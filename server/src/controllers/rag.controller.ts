import { Request, Response } from "express";
import { queryRAGPipeline } from "../services/rag.service";
// POST /api/documents/query
// Body: { query: string, documentIds?: string[], topK?: number }
//
// documentIds is optional — if omitted, the RAG pipeline searches across
// all documents the user has access to. Pass specific IDs to scope the
// search to particular uploaded files.

export const queryDocuments = async (req: Request, res: Response) => {
  try {
    const { query, documentIds = [], topK = 5 } = req.body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ message: "Query is required" });
    }

    if (typeof topK !== "number" || topK < 1 || topK > 20) {
      return res.status(400).json({ message: "topK must be a number between 1 and 20" });
    }

    if (!Array.isArray(documentIds)) {
      return res.status(400).json({ message: "documentIds must be an array" });
    }

    const result = await queryRAGPipeline(query.trim(), documentIds, topK);

    return res.status(200).json({
      success: true,
      query,
      answer: result.answer,
      sources: result.sources.map((s) => ({
        documentId: s.documentId,
        chunkIndex: s.chunkIndex,
        score: parseFloat(s.score.toFixed(4)),
        excerpt: s.chunkText.slice(0, 200) + (s.chunkText.length > 200 ? "…" : ""),
      })),
    });
  } catch (error: any) {
    console.error("queryDocuments error:", error);
    return res.status(500).json({ message: "Failed to process query" });
  }
};