import { hash, verify } from "argon2";

export function hashPassword(password: string): Promise<string> {
  return hash(password, { type: 2 });
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password);
}
