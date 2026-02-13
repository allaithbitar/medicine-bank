export type TLogin = {
  id: string;
  name: string;
  phone: string;
  role: "manager" | "supervisor" | "scout" | "accountant";
  areaId: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
  refreshToken: string;
};
