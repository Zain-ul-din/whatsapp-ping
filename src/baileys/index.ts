import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import { connectDB } from "./db";
import { useMongoDBAuthState } from "mongo-baileys";
import { updateConnectionStatus } from "../services/firestore";
import { saveContacts } from "../services/api";
import { socket } from "../services/socket-io";

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
  sock.ev.on("messaging-history.set", async (data) => {
    const contacts = data.contacts;
    console.log(
      "messaging-history.set",
      JSON.stringify(contacts.slice(0, 10), null, 2),
      `total: ${contacts.length}`
    );
    await saveContacts(contacts);
  });

  sock.ev.on("contacts.update", async (contacts) => {
    console.log(
      "contacts.update",
      JSON.stringify(contacts.slice(0, 10), null, 2),
      `total: ${contacts.length}`
    );
    await saveContacts(
      contacts.map((c) => ({ id: c.id, notify: c.notify, name: c.name }))
    );
  });

  sock.ev.on("contacts.upsert", async (contacts) => {
    console.log(
      "contacts.upsert",
      JSON.stringify(contacts.slice(0, 10), null, 2),
      `total: ${contacts.length}`
    );
    await saveContacts(contacts);
  });

  const setupAuth = new Promise(async (resolve, rej) => {
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      global.waQrCode = qr || "";
      await updateConnectionStatus({
        loading: false,
        connected: false,
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
              await updateConnectionStatus({
                connected: false,
                qrCode: "",
                loading: true
              });
              await connectToWhatsApp();
            }
          }
        } else if (connection === "open") {
          // connected user info
          console.info(
            "\n ✔ opened connection \n",
            JSON.stringify(sock.user, null, 2)
          );

          await updateConnectionStatus({
            connected: true,
            qrCode: qr ?? "",
            loading: false,
            user: sock.user
          });

          resolve(null);
        } else if (connection === "close") {
          console.info("\n↖ user log out ");
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
