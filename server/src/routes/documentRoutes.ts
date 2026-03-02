import express from "express";
import { uploadDocument } from "../controllers/documentController";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadDocument
);

export default router;