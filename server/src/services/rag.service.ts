import Groq from "groq-sdk";
import DocumentChunk from "../models/DocumentChunk";
import { generateEmbedding, cosineSimilarity } from "./embedding.service";

// Lazy Groq client — created on first use so .env is loaded before init
let _groq: Groq | null = null;

const getGroqClient = (): Groq => {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in your .env file");
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

export interface RetrievedChunk {
  chunkText: string;
  chunkIndex: number;
  documentId: string;
  score: number;
}

export interface RAGResult {
  answer: string;
  sources: RetrievedChunk[];
}

// ── Step 2: Retrieve top-K chunks by cosine similarity ───────────────────────
export const retrieveRelevantChunks = async (
  queryEmbedding: number[],
  documentIds: string[],
  topK: number = 3
): Promise<RetrievedChunk[]> => {

  const filter = documentIds.length > 0
    ? { documentId: { $in: documentIds }, embedding: { $ne: null } }
    : { embedding: { $ne: null } };

  // .lean() returns plain JS objects — faster and uses less memory
  const chunks = await DocumentChunk.find(filter)
    .select("documentId chunkText chunkIndex embedding")
    .lean();

  if (chunks.length === 0) return [];

  const scored: RetrievedChunk[] = chunks
    .filter((chunk) => chunk.embedding && chunk.embedding.length > 0)
    .map((chunk) => ({
      chunkText: chunk.chunkText,
      chunkIndex: chunk.chunkIndex,
      documentId: String(chunk.documentId),
      score: cosineSimilarity(queryEmbedding, chunk.embedding as number[]),
    }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
};

// ── Step 3: Build a grounded prompt ─────────────────────────────────────────
const buildPrompt = (query: string, chunks: RetrievedChunk[]): string => {
  const context = chunks
    .map((c, i) => `[${i + 1}] ${c.chunkText}`)
    .join("\n\n");

  return `You are a helpful assistant that answers questions strictly based on the provided document context.

CONTEXT:
${context}

INSTRUCTIONS:
- Answer the question using ONLY the context above.
- If the answer is not present in the context, say "I could not find an answer in the provided documents."
- Be concise and factual. Do not hallucinate.
- Reference context numbers like [1], [2] when citing specific information.

QUESTION: ${query}

ANSWER:`;
};

// ── Full RAG pipeline ────────────────────────────────────────────────────────
export const queryRAGPipeline = async (
  query: string,
  documentIds: string[] = [],
  topK: number = 3
): Promise<RAGResult> => {

  if (!query || query.trim().length === 0) {
    throw new Error("Query cannot be empty");
  }

  // 1. Embed the query using the same HuggingFace model used at ingestion
  const queryEmbedding = await generateEmbedding(query.trim());

  // 2. Retrieve top-K most similar chunks
  const relevantChunks = await retrieveRelevantChunks(queryEmbedding, documentIds, topK);

  if (relevantChunks.length === 0) {
    return {
      answer: "No relevant content found in the specified documents.",
      sources: [],
    };
  }

  // 3. Build grounded prompt with retrieved context
  const prompt = buildPrompt(query, relevantChunks);

  // 4. Generate answer with Groq (llama-3.3-70b — free, very capable)
  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,      // deterministic — important for factual RAG answers
    max_tokens: 2000,
  });

  const answer = completion.choices[0]?.message?.content?.trim()
    ?? "Failed to generate an answer.";

  return { answer, sources: relevantChunks };
};