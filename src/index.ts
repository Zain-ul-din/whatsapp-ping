import express from "express";
import { pingRoute } from "./routes";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(pingRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log(`server is listening on localhost:${PORT}`);
});
