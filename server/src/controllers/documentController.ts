import { Request, Response } from "express";
import Document from "../models/document.model";
import fs from "fs";
import path from "path";

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
    .basename(name)                    // strip any directory traversal
    .replace(/[^\w.\-\s]/g, "")       // only allow safe characters
    .trim()
    .slice(0, 200);                    // cap length
};

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    // GOOD: File presence check
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Guard against missing user context (protect middleware failure)
    const userId = (req as any).userId;
    if (!userId) {
      // Clean up the orphaned file before returning
      fs.unlink(req.file.path, () => { });
      return res.status(401).json({ message: "Unauthorized" });
    }

    //  Magic byte validation — second layer defense against MIME spoofing
    if (!isValidPDF(req.file.path)) {
      fs.unlink(req.file.path, () => { }); // Delete the invalid file immediately
      return res.status(400).json({ message: "Invalid file format" });
    }

    // Sanitize the original filename before storing it
    const safeTitle = sanitizeFilename(req.file.originalname) || "Untitled";

    const document = await Document.create({
      title: safeTitle,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,        // multer provides this automatically
      mimeType: req.file.mimetype,    // already validated at this point
      uploadedBy: userId,
    });

    // Never return filePath in the response — leaks server internals (OWASP A02)
    res.status(201).json({
      success: true,
      document: {
        id: document._id,
        title: document.title,
        fileName: document.fileName,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    // Generic error message — no stack trace leak
    // Clean up uploaded file if DB save fails
    if (req.file?.path) {
      fs.unlink(req.file.path, () => { });
    }
    res.status(500).json({ message: "Failed to upload document" });
  }
};