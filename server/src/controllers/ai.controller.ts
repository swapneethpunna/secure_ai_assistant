import { Request, Response } from "express";
import { createQueryEmbedding } from "../services/queryEmbedding.service";
import { searchSimilarChunks } from "../services/vectorSearch.service";
import { generateAnswer } from "../services/aiAnswer.service";

export const queryAI = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question required" });
    }

    // Step 1: Create query embedding
    const queryEmbedding = await createQueryEmbedding(question);

    // Step 2: Search similar chunks
    const similarChunks = await searchSimilarChunks(queryEmbedding);

    const context = similarChunks.map((c) => c.text);

    // Step 3: Generate answer
    const answer = await generateAnswer(question, context);

    res.json({
      question,
      answer,
      sources: similarChunks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI query failed" });
  }
};