import { WASocket } from "@whiskeysockets/baileys"; // Import the type for your socket

declare global {
  var waSock: WASocket | null;
  var waQrCode: string | null;
}

export {};
