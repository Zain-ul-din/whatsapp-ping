import { Request, Response } from "express";
import { delay } from "../lib/delay";

const pingController = async (req: Request, res: Response): Promise<void> => {
  if (global.waSock == null) {
    res.status(500).send({ error: "WA is not connected" });
    return;
  }
  const { message, numbers, image } = req.body;
  for (let number of numbers) {
    const id = `${number}@s.whatsapp.net`;
    if (image) {
      const imgToBase64 = Buffer.from(image, "base64");
      await global.waSock.sendMessage(id, {
        image: imgToBase64,
        caption: message
      });
    } else {
      await global.waSock.sendMessage(id, { text: message });
    }
    await delay(100 * Math.random());
  }
  res.status(200).send({ message: "success" });
};

export default pingController;
