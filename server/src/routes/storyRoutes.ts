import express from "express";
import {
  createStory,
  getStories,
  uploadS3,
  storyDetail,
  convertToSpeech,
} from "../controllers/storyController";
import multer from "multer";
import authMiddleware from "../middleware/auth";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", authMiddleware, upload.single("file"), createStory);
router.post("/uploadToS3", authMiddleware, upload.single("file"), uploadS3);
router.get("/", getStories);
router.post("/:id", storyDetail);
router.post("/convert-to-speech/:id", convertToSpeech);

export default router;
