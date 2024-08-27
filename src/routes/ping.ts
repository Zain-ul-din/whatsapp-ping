import express from "express";
import { pingController } from "../controllers";
import validatePingMessage from "../middlewares/ping-message-validator";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const route = express.Router();

route.use(limiter);
route.post("/ping", validatePingMessage, pingController);

export default route;
