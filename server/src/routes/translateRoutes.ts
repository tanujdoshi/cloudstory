import express from "express";
import authMiddleware from "../middleware/auth";
import { getLanguage } from "../controllers/TranslateController";

const router = express.Router();

router.get("/get", getLanguage);

export default router;
