import DocumentChunk from "../models/DocumentChunk";
import { cosineSimilarity } from "../utils/cosineSimilarity";

export const searchSimilarChunks = async (
  queryEmbedding: number[],
  topK: number = 5
) => {
  const chunks = await DocumentChunk.find();

  const scoredChunks = chunks.map((chunk: any) => {
    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);

    return {
      text: chunk.chunkText,
      score: similarity,
    };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, topK);
};