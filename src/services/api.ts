import { Contact } from "@whiskeysockets/baileys";
const BASE_URL = process.env.API_URL ?? "";

export async function saveContacts(contacts: Partial<Contact>[]) {
  await fetch(`${BASE_URL}/data/contacts`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SECRET}`
    },
    method: "POST",
    body: JSON.stringify({
      tenantId: process.env.TENANT_ID,
      contacts: contacts
    })
  });
}
