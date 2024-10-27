/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(
  password: string,
  _salt?: unknown
): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// function arrayBufferToHex(arrayBuffer: ArrayBuffer) {
//   return Array.from(new Uint8Array(arrayBuffer))
//     .map((byte) => byte.toString(16).padStart(2, "0"))
//     .join("");
// }

// export function createSalt() {
//   return arrayBufferToHex(crypto.getRandomValues(new Uint8Array(16)));
// }

// export async function hashPassword(password: string, salt: string) {
//   return arrayBufferToHex(
//     await crypto.subtle.digest(
//       "SHA-256",
//       new TextEncoder().encode(`${password}.${salt}`)
//     )
//   );
// }
