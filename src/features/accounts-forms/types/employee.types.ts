import type z from "zod";
import type { employeeAccountSchema } from "../schemas/employee-form-schema";

export type TEmployeeAccount = z.infer<typeof employeeAccountSchema>;

export const EMPLOYEE_ROLE = {
  manager: "manager",
  supervisor: "supervisor",
  scout: "scout",
} as const;

export type TEmployeeRole = (typeof EMPLOYEE_ROLE)[keyof typeof EMPLOYEE_ROLE];

export type TAddEmployeeAccountPayload = {
  name: string;
  password: string;
  phone: string;
  role: TEmployeeRole;
};

export type TEditEmployeeAccountPayload = {
  name: string;
  password: string;
  phone: string;
  role: TEmployeeRole;
  id: string;
  areaId?: string;
};
