import { z } from "zod";

export const WorkAreaSchema = z.object({
  name: z
    .string()
    .min(1, "Work Area Name is required")
    .max(100, "Name is too long"),
  cityId: z.string().uuid("Invalid City ID format").min(1, "City is required"),
});

export const UpdateWorkAreaSchema = WorkAreaSchema.extend({
  id: z.string().uuid("Invalid Work Area ID format"),
});
