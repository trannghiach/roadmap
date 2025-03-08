
import { z } from "zod";

// chucaobuon:
// lilsadfoqs: Create a schema as a z object for Login
export const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  userAgent: z.string().optional(),
});

// chucaobuon:
// lilsadfoqs: Create a schema as a z object for Register with password validation
export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24);
