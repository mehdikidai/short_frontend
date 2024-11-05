import { z } from 'zod';

export const zodEmail = z.string().email();
export const zodPassword = z.string().trim().min(8).max(30);
export const zodName = z.string().trim().min(3).max(20);
export const zodId = z.string().regex(/^[1-9][0-9]*$/);
export const zodCodeRestPass = z.string().regex(/^[a-z0-9]{6}$/);

export const updateSchema = z.object({
	name: zodName,
	email: zodEmail,
});

export const updatePasswordSchema = z.object({
	currentPassword: zodPassword,
	newPassword: zodPassword,
});

export default z;
