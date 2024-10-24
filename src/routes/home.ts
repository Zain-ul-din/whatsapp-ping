import express from "express";
import { getQrCodeController, homeController } from "../controllers";

const router = express.Router();

router.get("/", homeController);
router.post("/", getQrCodeController);

export default router;
