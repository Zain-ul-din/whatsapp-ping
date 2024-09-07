import { Request, Response } from "express";
import { connectToWhatsApp } from "../baileys";
import { delay } from "../lib/delay";
import AsyncReturnType from "../types/AsyncReturnType";

type WaClientType = AsyncReturnType<typeof connectToWhatsApp>;
let waClient: WaClientType;

if (process.env.SELF_HOSTED || process.env.LOCAL) {
  (async () => {
    waClient = await connectToWhatsApp();
  })();
}

const pingController = async (req: Request, res: Response): Promise<void> => {
  if (!waClient) {
    waClient = await connectToWhatsApp();
  }
  const { message, numbers } = req.body;
  for (let number of numbers) {
    const id = `${number}@s.whatsapp.net`;
    await waClient.sendMessage(id, { text: message });
    await delay(parseInt(process.env.NEXT_MSG_DELAY || "100") || 100);
  }
  res.status(200).send("success");
};

export default pingController;
