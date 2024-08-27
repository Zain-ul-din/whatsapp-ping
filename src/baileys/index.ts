import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";

const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

async function connectToWhatsApp() {
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", (message) => {
    console.log(message.messages[0].key.remoteJid);
  });

  await new Promise(async (resolve, rej) => {
    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      try {
        if (connection === "close" && lastDisconnect) {
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.log(
            "connection closed due to ",
            lastDisconnect.error,
            ", reconnecting ",
            shouldReconnect
          );
          // reconnect if not logged out
          if (shouldReconnect) {
            connectToWhatsApp();
          } else {
            // clear credentials
            if (lastDisconnect.error) {
              fs.rmSync("./auth_info_baileys", {
                force: true,
                recursive: true
              });
            }
          }
        } else if (connection === "open") {
          console.log("opened connection");
          resolve(null);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  return sock;
}

// run in main file
export { connectToWhatsApp };
