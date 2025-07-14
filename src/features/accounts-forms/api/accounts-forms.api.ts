import { rootApi } from "@/core/api/root.api";
import type {
  TAddEmployeeAccountPayload,
  TEditEmployeeAccountPayload,
} from "../types/employee.types";

export const accountsManagementApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addEmployee: builder.mutation<undefined, TAddEmployeeAccountPayload>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      transformResponse: () => undefined,
    }),
    editEmployee: builder.mutation<undefined, TEditEmployeeAccountPayload>({
      query: (body) => ({
        url: "/employees",
        method: "PUT",
        body,
      }),
      transformResponse: () => undefined,
    }),
  }),
});

export default accountsManagementApi;
