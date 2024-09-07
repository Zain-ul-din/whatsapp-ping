import { MongoClient } from "mongodb";
import { AuthenticationCreds } from "@whiskeysockets/baileys";

const dbName = "whatsapp";
const collectionName = "authState";

interface AuthDocument extends Document {
  _id: string;
  creds?: AuthenticationCreds;
}

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URL || "");
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection<AuthDocument>(collectionName);
  return { client, collection };
}

export { connectDB };
