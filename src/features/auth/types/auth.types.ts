import type { TEmployeeRole } from "@/features/accounts-forms/types/employee.types";

export type TLogin = {
  id: string;
  name: string;
  phone: string;
  role: TEmployeeRole;
  areaId: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
  refreshToken: string;
};
