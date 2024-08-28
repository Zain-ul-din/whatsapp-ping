import express from "express";
import { pingRoute } from "./routes";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import config from "platformsh-config";

config.config();

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(pingRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

app.listen(config.port || PORT, () => {
  console.log(`server is listening on localhost:${config.port || PORT}`);
});
