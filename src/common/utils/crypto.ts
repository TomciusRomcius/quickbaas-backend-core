import * as bcrypt from "bcrypt";

export async function hash(data: string) {
  return await bcrypt.hash(data, 10);
}

export async function comparePasswords(password: string, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
}