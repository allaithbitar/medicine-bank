import { rootApi } from "./root.api";
import type { TEmployeeAccount } from "../../form-schemas/employeeSchema";
import type { ApiResponse } from "../../types/common.types";

export const accountManagementApi = rootApi.injectEndpoints({
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

export default accountManagementApi;
