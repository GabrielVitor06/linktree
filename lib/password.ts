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

import crypto from "crypto";

export function createSalt(length: number = 16): string {
  return crypto.randomBytes(length).toString("hex");
}
