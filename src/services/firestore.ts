import { doc, setDoc } from "firebase/firestore";
import { collections } from "../lib/firebase";
import { BaileysConnectionStatus } from "../types/BaileysConnectionStatus";

export async function updateConnectionStatus(status: BaileysConnectionStatus) {
  const docRef = doc(collections.users, process.env.USER_ID);
  try {
    await setDoc(docRef, status, { merge: true });
  } catch (err) {
    console.error(err);
  }
}
