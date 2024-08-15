import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Story } from "../entities/Story";
import { User } from "../entities/User";
import { Readable } from "stream";
import path from "path";
import { unlink } from "fs/promises";
import s3 from "../config/s3";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { htmlToText } from "html-to-text";
import { translateContent, getAudioFromLambda } from "../config/aws";
import { analyzeText } from "../config/aws";

export const createStory = async (req: Request, res: Response) => {
  if (!process.env.S3_BUCKET_NAME) {
    return;
  }
  try {
    const storyRepository = AppDataSource.getRepository(Story);
    const userRepository = AppDataSource.getRepository(User);
    const { title, content, userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // call lambda
    console.log(user.name);

    const options = {
      wordwrap: 130,
      // Ignore all images
      ignoreImage: true,
      // Custom handling of tags
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { ignoreHref: true } },
      ],
    };

    const textTransformed = htmlToText(content, options);

    const obj = {
      text: textTransformed,
      user: user.name,
    };
    const isNegative = await analyzeText(obj);
    if (isNegative) {
      res
        .status(400)
        .json({ message: "You are trying to upload in appropriate content" });
      return;
    }
    const fileStream = require("fs").createReadStream(file.path);

    const fileExtension = path.extname(file.originalname);

    const uploadParams: PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `story-images/${Date.now()}${fileExtension}`,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(uploadParams).promise();
    await unlink(file.path);

    const newStory = storyRepository.create({
      title,
      content,
      imageUrl: data.Location,
      author: user,
    });

    await storyRepository.save(newStory);

    res.status(201).json({ message: "Story created successfully" });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Error creating story" });
  }
};

export const getStories = async (req: Request, res: Response) => {
  try {
    const storyRepository = AppDataSource.getRepository(Story);
    const stories = await storyRepository.find({ relations: ["author"] });
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Error fetching stories" });
  }
};

export const uploadS3 = async (req: Request, res: Response) => {
  if (!process.env.S3_BUCKET_NAME) {
    return;
  }
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { userId } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fileStream = require("fs").createReadStream(file.path);

    const fileExtension = path.extname(file.originalname);

    const uploadParams: PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `content-images/${Date.now()}${fileExtension}`,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(uploadParams).promise();
    await unlink(file.path);

    res
      .status(201)
      .json({ message: "Story created successfully", url: data.Location });
  } catch (error) {
    console.error("Error Uploading to S3:", error);
    res.status(500).json({ message: "Error creating story" });
  }
};

export const storyDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("selectedLanguage", req.body.languageCode);

  const storyRepository = AppDataSource.getRepository(Story);
  const story = await storyRepository.findOne({ where: { id: +id } });
  if (!story) {
    res.status(500).json({ message: "Story not available with specified ID" });
  }
  const obj = {
    source: "en",
    target: req.body.languageCode,
    text: story?.content,
  };
  const translated = await translateContent(obj);

  const response = {
    content: translated.TranslatedText,
    id: story?.id,
    imageUrl: story?.imageUrl,
    title: story?.title,
  };
  res.json(response);
};

export const convertToSpeech = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { language, text } = req.body;
    const storyRepository = AppDataSource.getRepository(Story);
    const story = await storyRepository.findOne({ where: { id: +id } });
    if (story == null) {
      res
        .status(500)
        .json({ message: "Story not available with specified ID" });
      return;
    }

    const options = {
      wordwrap: 130,
      // Ignore all images
      ignoreImage: true,
      // Custom handling of tags
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { ignoreHref: true } },
      ],
    };

    const textTransformed = htmlToText(text, options);

    const obj = {
      text: textTransformed,
      language: language,
    };
    const audioBuffer = await getAudioFromLambda(obj);

    if (!audioBuffer || audioBuffer == null) return;
    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Length", audioBuffer.length.toString());

    res.send(audioBuffer);
  } catch (err) {
    console.log("ERRROR", err);
  }
};
