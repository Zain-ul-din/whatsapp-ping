import express from "express";
import { homeRoute, pingRoute } from "./routes";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectToWhatsApp } from "./baileys";

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cors({ origin: "*" }));
app.use(express.static("public"));

app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(homeRoute);
app.use(pingRoute);

app.use((_, res) => {
  res.status(404).json({ message: "Resource not found" });
});

(async () => {
  await connectToWhatsApp();
})();

app.listen(PORT, () => {
  console.log(`server is listening on localhost:${PORT}`);
});
