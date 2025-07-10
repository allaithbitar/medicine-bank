import { rootApi } from "./root.api";
import type { ApiResponse } from "./common";
import type { TEmployeeAccount } from "../../form-schemas/employeeSchema";

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
