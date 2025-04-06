import { io } from "socket.io-client";
import { BaileysConnectionStatus } from "../types/BaileysConnectionStatus";

export const socket = io(process.env.API_URL);

export async function updateConnectionStatus(status: BaileysConnectionStatus) {
  socket.emit("connection:update", {
    ...status,
    updatedAt: new Date().toISOString(),
    tenantId: process.env.TENANT_ID
  });
}
