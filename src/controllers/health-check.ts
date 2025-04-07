import { Request, Response } from "express";
import { apiResponseSuccess } from "../constants/api-responses";

export const healthCheckController = async (req: Request, res: Response) => {
  res.status(200).json(apiResponseSuccess());
};
