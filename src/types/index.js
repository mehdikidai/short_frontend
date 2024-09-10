import { z } from "zod";

export const zodEmail = z.string().email()
export const zodPassword = z.string().trim().min(8).max(30)
export const zodName = z.string().trim().min(3).max(20)

export default z