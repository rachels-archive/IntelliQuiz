import { z } from "zod";

export const questionSchema = z.object({
  text: z.string().min(1, { message: "Input text is required." }),
  choices: z.array(z.string()).min(2, { message: "At least two choices are required." }),
  answer: z.string().optional(), // If you want to include an answer
});
