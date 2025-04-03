import { Contact } from "@whiskeysockets/baileys";

export type BaileysConnectionStatus = {
  loading: boolean;
  qrCode: string;
  connected?: boolean;
  user?: Contact;
};
