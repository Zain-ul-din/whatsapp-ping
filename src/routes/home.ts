import express from "express";
import { homeController } from "../controllers";
import authentication from "../middlewares/api-key-authentication";

const router = express.Router();

router.use(authentication);
router.get("/", homeController);

export default router;
