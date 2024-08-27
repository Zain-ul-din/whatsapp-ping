import { Request, Response } from "express";

const pingController = async (req: Request, res: Response): Promise<void> => {
  console.log("here");
  res.status(200).send("success");
};

export default pingController;
