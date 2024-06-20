import { z } from "zod";

const verifySchema = z.object({
  code: z.string().length(6, "verfication code must be in 6 digits"),
});
