import { Request, Response } from "express";
import Document from "../models/document.model";
import fs from "fs";
import path from "path";
import DocumentChunk from "../models/DocumentChunk";
import { splitTextIntoChunks } from "../utils/textChunker";
import { generateEmbeddings } from "../services/embedding.service";

// Validates actual PDF magic bytes ("%PDF") — prevents MIME spoofing (OWASP A03)
const isValidPDF = (filePath: string): boolean => {
  try {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return buffer.toString("ascii") === "%PDF";
  } catch {
    return false;
  }
};

// Sanitize user-provided filename for safe storage as document title
const sanitizeFilename = (name: string): string => {
  return path
    .basename(name)
    .replace(/[^\w.\-\s]/g, "")
    .trim()
    .slice(0, 200);
};

// Extract text from PDF using pdf2json
const extractTextFromPDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const PDFParser = require("pdf2json");
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (err: any) => reject(err.parserError));

    parser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        const text = pdfData.Pages.map((page: any) =>
          page.Texts.map((t: any) =>
            decodeURIComponent(t.R.map((r: any) => r.T).join(""))
          ).join(" ")
        ).join("\n");
        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    parser.parseBuffer(buffer);
  });
};

const cleanupFile = (filePath?: string) => {
  if (filePath) fs.unlink(filePath, () => {});
};

export const uploadDocument = async (req: Request, res: Response) => {
  let documentId: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = (req as any).userId;
    if (!userId) {
      cleanupFile(req.file.path);
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isValidPDF(req.file.path)) {
      cleanupFile(req.file.path);
      return res.status(400).json({ message: "Invalid file format" });
    }

    const safeTitle = sanitizeFilename(req.file.originalname) || "Untitled";

    const document = await Document.create({
      title: safeTitle,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: userId,
    });
    documentId = String(document._id);

    const pdfBuffer = fs.readFileSync(req.file.path);
    const extractedText = await extractTextFromPDF(pdfBuffer);

    if (!extractedText || extractedText.trim().length < 20) {
      await Document.findByIdAndDelete(documentId);
      cleanupFile(req.file.path);
      return res.status(400).json({ message: "PDF contains no readable text" });
    }

    const chunks = splitTextIntoChunks(extractedText, 500, 50);
    const chunkTexts = chunks.map((chunk) => chunk);
    const embeddings: number[][] = await generateEmbeddings(chunks);

    const chunkDocuments = chunks.map((chunk: string, index: number) => ({
      documentId: document._id,
      chunkText: chunk,
      chunkIndex: index,
      embedding: embeddings[index],
    }));

    await DocumentChunk.insertMany(chunkDocuments);
    return res.status(201).json({
      success: true,
      document: {
        id: document._id,
        title: document.title,
        fileName: document.fileName,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        totalChunks: chunkDocuments.length,
      },
    });
  } catch (error: any) {
    if (documentId) {
      await Document.findByIdAndDelete(documentId).catch(() => {});
      await DocumentChunk.deleteMany({ documentId }).catch(() => {});
    }
    cleanupFile(req.file?.path);
    console.error("uploadDocument error:", error);
    return res.status(500).json({ message: "Failed to upload document" });
  }
};