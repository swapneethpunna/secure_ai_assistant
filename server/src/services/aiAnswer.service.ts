import axios from "axios";

export const generateAnswer = async (
  question: string,
  contextChunks: string[]
) => {
  const context = contextChunks.join("\n\n");

  const prompt = `
You are a helpful AI assistant.

Context:
${context}

Question:
${question}

Answer based only on the context.
`;

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/google/flan-t5-large",
    {
      inputs: prompt,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
    }
  );

  return response.data[0].generated_text;
};