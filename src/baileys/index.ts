import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import { connectDB } from "./db";
import { useMongoDBAuthState } from "mongo-baileys";

async function connectToWhatsApp(onStart?: () => void) {
  const { state, saveCreds } = process.env.MONGO_URL
    ? await useMongoDBAuthState((await connectDB()).collection as any)
    : await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    mobile: false,
    keepAliveIntervalMs: 10000,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    defaultQueryTimeoutMs: undefined,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  const setupAuth = new Promise(async (resolve, rej) => {
    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;
      global.waQrCode = qr || null;
      try {
        if (connection === "close" && lastDisconnect) {
          const statusCode = (lastDisconnect.error as Boom)?.output?.statusCode;
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.log(
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
          console.log("\n ✔ opened connection \n");
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

// run in main file
export { connectToWhatsApp };
