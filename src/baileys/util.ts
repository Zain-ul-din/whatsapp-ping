import path from "path";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import { decrypt, encrypt } from "../lib/cipher";

export const encryptAuthState = (folderPath: string) => {
  const dirPath = path.join(process.cwd(), folderPath);
  if (!existsSync(dirPath)) return;
  readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const fileContent = readFileSync(filePath, "utf-8");
    const encryptedContent = encrypt(fileContent);
    writeFileSync(filePath, encryptedContent, "utf-8");
  });
};

export const decryptAuthState = (
  folderPath: string,
  outputFolderPath: string
) => {
  const dirPath = path.join(process.cwd(), folderPath);
  const outputPath = path.join(process.cwd(), outputFolderPath);

  if (!existsSync(outputPath)) mkdirSync(outputPath);

  if (!existsSync(dirPath)) return;
  readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const outputFilePath = path.join(outputPath, file);

    const encryptedContent = readFileSync(filePath, "utf-8");
    try {
      const decryptedContent = decrypt(encryptedContent);
      writeFileSync(
        outputFilePath,
        JSON.stringify(JSON.parse(decryptedContent)),
        "utf-8"
      );
    } catch (err) {
      console.log(err);
      writeFileSync(
        outputFilePath,
        JSON.stringify(JSON.parse(encryptedContent)),
        "utf-8"
      );
    }
  });
};
