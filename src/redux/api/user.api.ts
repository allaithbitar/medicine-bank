import type { ApiResponse } from "./common";
import { indexApi } from "./index.api";

interface LoginRes {
  id: number;
  userName: string;
  token: string;
}

export const userSlice = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginRes, { username: string; password: string }>({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<LoginRes>) => res.data,
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "refreshToken",
      }),
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = userSlice;

export default userSlice;
