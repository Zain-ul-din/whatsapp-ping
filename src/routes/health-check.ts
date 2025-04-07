import { Router } from "express";
import { healthCheckController } from "../controllers";

const healthCheckRoute = Router();

healthCheckRoute.get("/", healthCheckController);
healthCheckRoute.post("/", healthCheckController);

export { healthCheckRoute };
