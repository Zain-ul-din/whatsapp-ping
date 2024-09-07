import { Request, Response } from "express";
import { connectToWhatsApp } from "../baileys";
import { delay } from "../lib/delay";

const pingController = async (req: Request, res: Response): Promise<void> => {
  const waClient = await connectToWhatsApp();
  const { message, numbers } = req.body;
  for (let number of numbers) {
    const id = `${number}@s.whatsapp.net`;
    await waClient.sendMessage(id, { text: message });
    await delay(100);
  }
  res.status(200).send("success");
};

export default pingController;
