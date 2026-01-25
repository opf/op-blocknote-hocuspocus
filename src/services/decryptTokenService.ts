import { createDecipheriv, createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const ALGORITHM = "aes-256-gcm";

const SECRET = (
  process.env.SECRET_FILE
  ? fs.readFileSync(process.env.SECRET_FILE, { encoding: 'utf8', flag: 'r' })
  : process.env.SECRET
);
if (!SECRET) {
  throw new Error("SECRET_FILE or SECRET environment variable must be set.");
}
const SECRET_HASH = createHash("sha256").update(SECRET).digest();

type PackedParams = {
  resource_url: string;
  oauth_token: string;
  readonly: boolean;
};

/**
 * Decrypts a given token using AES-256-GCM algorithm.
 */
export function decryptToken(encrypted:string):PackedParams {
  const [token, iv, authTag] = encrypted.split('--').map((part:string) => Buffer.from(part, 'base64'));

  const decipher = createDecipheriv(ALGORITHM, SECRET_HASH, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(token),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString());
}
