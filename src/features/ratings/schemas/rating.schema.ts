import { z } from "zod";

export const RatingSchema = z.object({
  name: z
    .string()
    .min(1, "rating Name is required")
    .max(100, "Name is too long"),
  code: z.string().min(1),
  description: z.string().min(1, "rating description is required"),
});

export const UpdateRatingSchema = RatingSchema.extend({
  id: z.string().uuid("Invalid rating Id format"),
});
