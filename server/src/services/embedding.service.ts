import axios from "axios";

// HuggingFace router new URL format (pipeline/ path is gone)
const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

const getHFEmbeddings = async (texts: string[]): Promise<number[][]> => {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not set in your .env file");
  }

  const response = await axios.post(
    HF_API_URL,
    { inputs: texts, options: { wait_for_model: true } },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as number[][];
};

export const generateEmbeddings = async (texts: string[]): Promise<number[][]> => {
  if (texts.length === 0) return [];

  const BATCH_SIZE = 32;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const embeddings = await getHFEmbeddings(batch);
    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const results = await generateEmbeddings([text]);
  return results[0];
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) throw new Error("Vector length mismatch");

  let dot = 0, normA = 0, normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
};