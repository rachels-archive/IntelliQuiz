import { z } from "zod";
import { questionSchema } from "./questions";

export const quizCreationSchema = z.object({
  id: z.string().uuid().optional(), // Assuming ID is a UUID, optional for creating new quizzes
  userId: z.number().int().positive({ message: "User ID must be a positive integer." }),
  createdAt: z.date().optional(), // Optional for creating new quizzes, can be set automatically
  timeStarted: z.date().optional(),
  timeEnded: z.date().optional(),
  questions: z.array(questionSchema).min(1, { message: "At least one question is required." }), // At least one question

  // Additional validation can be applied as needed
});
