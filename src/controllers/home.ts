import { Request, Response } from "express";
import { apiResponseData, apiResponseError } from "../constants/api-responses";

export const homeController = (req: Request, res: Response) => {
  if (!global.waSock) {
    return res
      .status(425)
      .json(apiResponseError("Still Connecting to WhatsApp"));
  }

  res.status(200).json(
    apiResponseData({
      qrCode: global.waQrCode,
      user: global.waSock.user,
      connected: Boolean(global.waSock.user)
    })
  );
};
