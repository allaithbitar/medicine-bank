import type { TEmployeeAccount } from "../../pages/accountManagement/schema/employeeSchema";
import { apiSlice } from "./apiSlice";
import type { ApiResponse } from "./common";

export const accountManagementSlice = apiSlice.injectEndpoints({
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

export const { useAddEmployeeMutation } = accountManagementSlice;

export default accountManagementSlice;
