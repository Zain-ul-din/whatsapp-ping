import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import { connectDB } from "./db";
import { useMongoDBAuthState } from "mongo-baileys";
import { saveContacts } from "../services/api";

async function connectToWhatsApp(onStart?: () => void) {
  const { state, saveCreds } = process.env.MONGO_URL
    ? await useMongoDBAuthState((await connectDB()).collection as any)
    : await useMultiFileAuthState("auth_info_baileys");

  global.waSock = makeWASocket({
    printQRInTerminal: true,
    mobile: false,
    keepAliveIntervalMs: 10000,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    defaultQueryTimeoutMs: undefined,
    auth: state
  });

  global.waSock.ev.on("creds.update", saveCreds);

  // export numbers from all your previous individual conversations
  global.waSock.ev.on("messaging-history.set", async (data) => {
    const contacts = data.contacts;
    await saveContacts(contacts);
  });

  global.waSock.ev.on("contacts.update", async (contacts) => {
    await saveContacts(
      contacts.map((c) => ({ id: c.id, notify: c.notify, name: c.name }))
    );
  });

  global.waSock.ev.on("contacts.upsert", async (contacts) => {
    await saveContacts(contacts);
  });

  const setupAuth = new Promise(async (resolve, rej) => {
    if (!global.waSock) return;

    global.waSock.ev.on("connection.update", async (update) => {
      if (!global.waSock) return;

      const { connection, lastDisconnect, qr } = update;

      global.waQrCode = qr || "";

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
            await connectToWhatsApp();
          } else {
            // clear credentials
            if (lastDisconnect.error) {
              if (fs.existsSync("./auth_info_baileys")) {
                fs.rmSync("./auth_info_baileys", {
                  force: true,
                  recursive: true
                });
              }

              await connectToWhatsApp();
            }
          }
        } else if (connection === "open") {
          // connected user info
          console.info(
            "\n ✔ opened connection \n",
            JSON.stringify(global.waSock.user, null, 2)
          );

          resolve(null);
        } else if (connection === "close") {
          console.info("\n↖ user log out ");
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  const FIVE_MIN_IN_MS = 1000 * 10; //* 60 * 5;

  const closeConnection = async () => {
    console.info("🔃 Going to close Whatsapp connection");
    global.waSock?.logout("Programmatically closing timeout connection");
    console.info("✔ Done closing Whatsapp connection");
  };

  process.on("SIGTERM", closeConnection);
  process.on("SIGINT", closeConnection);

  await Promise.race([
    setupAuth,
    new Promise((_, rej) => {
      setTimeout(async () => {
        await closeConnection();
        rej("Timeout while setting up connection to whatsapp");
      }, FIVE_MIN_IN_MS);
    })
  ]);
}

export { connectToWhatsApp };
