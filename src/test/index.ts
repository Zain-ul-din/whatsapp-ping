import dotenv from "dotenv";
dotenv.config();

import { decrypt, encrypt } from "../lib/cipher";
import assert from "assert";

const data = "hello world";

const encryptedData = encrypt(data);
assert(encryptedData !== data, "Encrypted data should not be equal to data");

const decryptedData = decrypt(encryptedData);
assert(decryptedData === data, "decrypted data must be equal to data");

console.log("✔ All test has been passed");
