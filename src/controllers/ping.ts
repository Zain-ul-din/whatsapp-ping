import { Request, Response } from "express";
import { connectToWhatsApp } from "../baileys";

const pingController = async (req: Request, res: Response): Promise<void> => {
  const waClient = await connectToWhatsApp();
  const { message, number } = req.body;
  const id = `${number}@s.whatsapp.net`;
  await waClient.sendMessage(id, { text: message });
  res.status(200).send("success");
};

export default pingController;
