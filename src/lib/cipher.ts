import { Encoding, createCipheriv, createDecipheriv, createHash } from "crypto";

const CIPHER_ALGO = "aes-256-cbc";
const ENCRYPTED_DATA_ENCODING: Encoding = "base64";

const getCredentials = () => ({
  key: Buffer.from(process.env.KEY || "", "base64"),
  iv: Buffer.from(process.env.IV || "", "base64")
});

export function encrypt(data: string) {
  const { key, iv } = getCredentials();
  const cipher = createCipheriv(CIPHER_ALGO, key, iv);
  var crypted = cipher.update(data, "utf8", ENCRYPTED_DATA_ENCODING);
  crypted += cipher.final("base64");
  return crypted;
}

export function decrypt(data: string) {
  const { key, iv } = getCredentials();
  const decipher = createDecipheriv(CIPHER_ALGO, key, iv);
  let decrypted = decipher.update(data, ENCRYPTED_DATA_ENCODING, "utf8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
