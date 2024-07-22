import { z } from "zod";

export const forgotPasswordSchema = z.object({
  forgotPasswordCode: z.string().length(6, { message: "Must be 6 charecters" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be atleast 8 charecters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be atleast 8 charecters" }),
});
