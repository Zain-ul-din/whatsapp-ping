import { Request, Response } from "express";

export const homeController = (req: Request, res: Response) => {
  res.render("index");
};

export const getQrCodeController = (req: Request, res: Response) => {
  const apiKey = req.body.api_key;

  if (apiKey != process.env.API_KEY) {
    res.render("error", { message: "Invalid Credentials" });
    return;
  }

  if (global.waQrCode) {
    res.render("qr", { qr: global.waQrCode });
  } else {
    res.render("qr", { qr: "" });
  }
};
