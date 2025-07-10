import { rootApi } from "@/core/api/root.api";
import type { ApiResponse } from "@/core/types/common.types";
import type { TEmployeeAccount } from "../types/employee.types";

export const accountsManagementApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addEmployee: builder.mutation<any, TEmployeeAccount>({
      query: (data) => ({
        url: "addEmployee",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<any>) => res.data,
    }),
  }),
});

export default accountsManagementApi;
