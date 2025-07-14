import z from "zod";
import { EMPLOYEE_ROLE } from "../types/employee.types";

const baseEmployeeSchema = z.object({
  name: z
    .string()
    .min(3, "Employee Name too short")
    .max(100, "Employee Name too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s-()]{7,20}$/, "Invalid phone number format"),
  role: z.enum([
    EMPLOYEE_ROLE.manager,
    EMPLOYEE_ROLE.supervisor,
    EMPLOYEE_ROLE.scout,
  ]),
  workArea: z.any(),
});

export const employeeAccountSchema = baseEmployeeSchema
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateEmployeeAccountSchema = baseEmployeeSchema.extend({
  id: z.string().uuid("Invalid Employee ID format"),
  password: z.string().min(6).optional(),
});
