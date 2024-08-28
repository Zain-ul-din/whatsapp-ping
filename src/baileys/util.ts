import path from "path";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { decrypt, encrypt } from "../lib/cipher";

export const encryptAuthState = (folderPath: string) => {
  const dirPath = path.join(process.cwd(), folderPath);
  readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const fileContent = readFileSync(filePath, "utf-8");
    const encryptedContent = encrypt(fileContent);
    writeFileSync(filePath, encryptedContent, "utf-8");
  });
};

export const decryptAuthState = (folderPath: string) => {
  const dirPath = path.join(process.cwd(), folderPath);
  readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const encryptedContent = readFileSync(filePath, "utf-8");
    try {
      const decryptedContent = decrypt(encryptedContent);
      writeFileSync(
        filePath,
        JSON.stringify(JSON.parse(decryptedContent)),
        "utf-8"
      );
    } catch (err) {
      writeFileSync(
        filePath,
        JSON.stringify(JSON.parse(encryptedContent)),
        "utf-8"
      );
    }
  });
};