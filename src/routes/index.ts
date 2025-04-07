import pingRoute from "./ping";
import homeRoute from "./home";
import { healthCheckRoute } from "./health-check";
import type { Application } from "express";

export default function routes(app: Application) {
  app.use("/", homeRoute);
  app.use("/ping", pingRoute);
  app.use("/health", healthCheckRoute);
}
