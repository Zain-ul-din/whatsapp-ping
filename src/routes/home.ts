import express from "express";
import { homeController } from "../controllers";
import authentication from "../middlewares/api-key-authentication";

const router = express.Router();

router.get("/", authentication, homeController);

export default router;
