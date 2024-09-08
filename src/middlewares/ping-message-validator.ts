import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const pingMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required and must be a non-empty string"),
  numbers: z
    .array(
      z
        .string()
        .min(12, "Each number must be at least 12 characters long")
        .regex(
          /^\d{12}$/,
          "Invalid phone number format. Correct example: 123456789012"
        )
    )
    .max(5, "You can provide a maximum of 5 phone numbers"),
  image: z.string().optional()
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
