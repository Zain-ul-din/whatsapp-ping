import { Request, Response, NextFunction } from "express";

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const apiKey = authHeader.split("Bearer ").at(-1);
  if (!apiKey) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  if (process.env.API_KEY && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authentication;
