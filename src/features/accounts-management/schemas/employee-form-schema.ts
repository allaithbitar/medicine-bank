import z from "zod";

export const employeeAccountSchema = z
  .object({
    id: z.string().optional(),
    employeeName: z
      .string()
      .min(3, "Employee Name too short")
      .max(100, "Employee Name too long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[0-9\s-()]{7,20}$/, "Invalid phone number format"),
    position: z.string(),
    workArea: z.any(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
