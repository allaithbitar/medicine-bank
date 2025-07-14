import { rootApi } from "@/core/api/root.api";
import type { TLogin } from "../types/auth.types";
import type { ApiResponse } from "@/core/types/common.types";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TLogin, { phone: string; password: string }>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<TLogin>) => res.data,
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "refreshToken",
      }),
      transformResponse: (res) => res.data,
    }),
  }),
});

export default authApi;
