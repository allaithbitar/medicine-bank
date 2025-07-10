import type z from "zod";
import type { employeeAccountSchema } from "../schemas/employee-form-schema";

export type TEmployeeAccount = z.infer<typeof employeeAccountSchema>;
