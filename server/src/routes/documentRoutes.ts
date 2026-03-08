import express from "express";
import { uploadDocument } from "../controllers/documentController";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";
import { queryDocuments } from "../controllers/rag.controller";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadDocument
);

router.post(
  "/query",
  protect,
  queryDocuments
);

export default router;