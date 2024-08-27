import express from "express";
import { pingController } from "../controllers";
import validatePingMessage from "../middlewares/ping-message-validator";

const route = express.Router();

route.use();

route.post("/ping", validatePingMessage, pingController);
export default route;
