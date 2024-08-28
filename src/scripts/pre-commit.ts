/**
 * A script runs before commit makes sure we are not pushing any sensitive information over github
 */
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { encrypt } from "../lib/cipher";
import { readdirSync, readFileSync, writeFileSync } from "fs";

const folderPath = "/auth_info_baileys";
const dirPath = path.join(process.cwd(), folderPath);

readdirSync(dirPath).forEach((file) => {
  const filePath = path.join(dirPath, file);
  const fileContent = readFileSync(filePath, "utf-8");
  try {
    JSON.parse(fileContent);
    const encryptedContent = encrypt(fileContent);
    writeFileSync(filePath, encryptedContent, "utf-8");
  } catch (_) {
    // file is already encrypted
  }
});

console.log("Success - All Auth files has been encrypted ✔");
