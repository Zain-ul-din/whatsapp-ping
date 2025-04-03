import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import { connectDB } from "./db";
import { useMongoDBAuthState } from "mongo-baileys";
import { updateConnectionStatus } from "../services/firestore";

async function connectToWhatsApp(onStart?: () => void) {
  const { state, saveCreds } = process.env.MONGO_URL
    ? await useMongoDBAuthState((await connectDB()).collection as any)
    : await useMultiFileAuthState("auth_info_baileys");

  await updateConnectionStatus({ loading: true, qrCode: "" });

  const sock = makeWASocket({
    printQRInTerminal: true,
    mobile: false,
    keepAliveIntervalMs: 10000,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    defaultQueryTimeoutMs: undefined,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  // export numbers from all your previous individual conversations
  sock.ev.on("messaging-history.set", (data) => {
    const contacts = data.contacts;
    console.log(
      "messaging-history.set",
      JSON.stringify(contacts.slice(0, 10), null, 2),
      `total: ${contacts.length}`
    );
  });

  sock.ev.on("contacts.upsert", (contacts) => {
    console.log(
      "contacts.upsert",
      JSON.stringify(contacts.slice(0, 10), null, 2),
      `total: ${contacts.length}`
    );
  });

  const setupAuth = new Promise(async (resolve, rej) => {
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      global.waQrCode = qr || "";
      await updateConnectionStatus({
        loading: true,
        qrCode: global.waQrCode
      });

      try {
        if (connection === "close" && lastDisconnect) {
          const statusCode = (lastDisconnect.error as Boom)?.output?.statusCode;
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.error(
            "connection closed due to ",
            lastDisconnect.error,
            ", status code: ",
            statusCode,
            ", reconnecting ",
            shouldReconnect
          );

          // reconnect if not logged out
          if (shouldReconnect) {
            connectToWhatsApp();
          } else {
            // clear credentials
            if (lastDisconnect.error) {
              if (fs.existsSync("./auth_info_baileys")) {
                fs.rmSync("./auth_info_baileys", {
                  force: true,
                  recursive: true
                });
              }
            }
          }
        } else if (connection === "open") {
          console.info("\n ✔ opened connection \n");
          resolve(null);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  const FIVE_MIN_IN_MS = 1000 * 60 * 5;

  await Promise.race([
    setupAuth,
    new Promise((_, rej) =>
      setTimeout(
        () => rej("Timeout while setting up connection to whatsapp"),
        FIVE_MIN_IN_MS
      )
    )
  ]);

  global.waSock = sock;
}

export { connectToWhatsApp };
