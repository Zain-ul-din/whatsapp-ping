import express from "express";
import { homeRoute, pingRoute } from "../src/routes";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cors({ origin: "*" }));
app.use(express.static("public"));

app.use(bodyParser.json({ limit: "20mb" }));
app.use(homeRoute);
app.use(pingRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

const startApp = () => {
  app.listen(PORT, () => {
    console.log(`server is listening on localhost:${PORT}`);
  });
};

export default startApp;
