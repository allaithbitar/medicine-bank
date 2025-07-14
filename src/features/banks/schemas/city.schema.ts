import { z } from "zod";

export const CitySchema = z.object({
  name: z
    .string()
    .min(3, "City name must be at least 3 characters long")
    .max(50, "City name cannot exceed 50 characters")
    .trim(),
});

// export type TCity = z.infer<typeof CitySchema>;
