import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "UserName must be atleast 3 charecters")
  .max(10, "UserName must be atmost 10 charecters")
  .regex(/^[a-zA-Z0-9_]+$/, "User name not contain any speical characters");

export const signupSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 charecters" }),
});
