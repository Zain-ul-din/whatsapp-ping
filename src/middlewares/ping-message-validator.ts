import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const pingMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required and must be a non-empty string"),
  number: z
    .string()
    .min(12, "number length must be 12")
    .regex(
      /^\d{12}$/,
      "Invalid phone number. correct number example 123456789012"
    )
});

const validatePingMessage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    pingMessageSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default validatePingMessage;
