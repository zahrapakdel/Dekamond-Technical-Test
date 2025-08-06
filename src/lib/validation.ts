import { z } from 'zod';

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^09\d{9}$/, 'Phone number must be 11 digits starting with 09')
    .min(11, 'Phone number must be exactly 11 digits')
    .max(11, 'Phone number must be exactly 11 digits'),
});

export type LoginFormData = z.infer<typeof loginSchema>;