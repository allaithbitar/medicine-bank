import { rootApi } from "@/core/api/root.api";
import type { ApiResponse } from "@/core/types/common.types";

interface LoginRes {
  id: number;
  userName: string;
  token: string;
}

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginRes, { username: string; password: string }>({
      query: (data) => ({
        url: "/auth/login​",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<LoginRes>) => res.items,
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
