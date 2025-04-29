import bcrypt from "bcrypt";
import { jwtConfig } from "../config/config";

export const encryptAsync = async (password: string) => {
  return await bcrypt.hash(password, jwtConfig.saltRound);
};

export const encryptSync = (password: string) => {
  return bcrypt.hashSync(password, jwtConfig.saltRound);
};

export const compareSync = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export const compareAsync = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
