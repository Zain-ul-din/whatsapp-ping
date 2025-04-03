import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { collections } from "../lib/firebase";
import { BaileysConnectionStatus } from "../types/BaileysConnectionStatus";
import { socket } from "./socket-io";

export async function updateConnectionStatus(status: BaileysConnectionStatus) {
  socket.emit("connection:update", {
    ...status,
    updatedAt: new Date().toISOString(),
    tenantId: process.env.TENANT_ID
  });

  const docRef = doc(collections.users, process.env.TENANT_ID);
  try {
    await setDoc(
      docRef,
      { ...status, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error(err);
  }
}
