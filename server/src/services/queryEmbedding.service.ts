import axios from "axios";

export const createQueryEmbedding = async (query: string): Promise<number[]> => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      {
        inputs: query,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    return response.data[0];
  } catch (error) {
    console.error("Embedding generation failed", error);
    throw new Error("Embedding error");
  }
};