/**
 * A script runs before commit makes sure we are not pushing any sensitive information over github
 */
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { encrypt } from "../lib/cipher";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

if (process.env.ENVIRONMENT === "production") {
  process.exit(0);
}

const folderPath = "/auth_info_baileys";
const dirPath = path.join(process.cwd(), folderPath);

if (!existsSync(dirPath)) {
  console.log(`directory ${folderPath} doesn't exists`);
  process.exit(0);
}

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

exec(`git add ${dirPath}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }

  console.log(stdout);
  console.log(stderr);
});

console.log("Success - All Auth files has been encrypted ✔");
