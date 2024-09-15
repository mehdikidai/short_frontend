import { z } from "zod";

export const zodEmail = z.string().email();
export const zodPassword = z.string().trim().min(8).max(30);
export const zodName = z.string().trim().min(3).max(20);
export const zodId = z.string().regex(/^[1-9][0-9]*$/);

export default z;
