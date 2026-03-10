import express from "express";
import { queryAI } from "../controllers/ai.controller";

const router = express.Router();

router.post(
  "/query",
  queryAI
);

export default router;