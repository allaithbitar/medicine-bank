import type { TArea } from "@/features/banks/types/work-areas.types";

export const EmployeeRole = {
  manager: "manager",
  supervisor: "supervisor",
  scout: "scout",
} as const;

export type TEmployeeRole = keyof typeof EmployeeRole;

export type TAddEmployeeDto = {
  name: string;
  password: string;
  areaId?: string;
  phone: string;
  role: TEmployeeRole;
};

export type TUpdateEmployeeDto = TAddEmployeeDto & { id: string };

export type TSearchEmployeesDto = {
  pageSize?: number;
  pageNumber?: number;
  areaId?: string;
  query?: string;
  role?: TEmployeeRole[];
};

export type TEmployeeArea =
  | { areaId: null; area: null }
  | { areaId: string; area: TArea };

export type TEmployee = {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
} & TEmployeeArea;
