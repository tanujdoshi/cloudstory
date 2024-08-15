import { Request, Response } from "express";
import { getLanguages } from "../config/aws";

export const getLanguage = async (req: Request, res: Response) => {
  try {
    const languages = await getLanguages();
    return res.json({ languages, message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error Getting language" });
  }
};
