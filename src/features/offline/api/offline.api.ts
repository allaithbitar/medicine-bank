import { rootApi } from "@/core/api/root.api";

export const offlineApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    sync: builder.query<any, any>({
      query: (data) => ({
        url: "offline/sync",
        params: data,
      }),
      providesTags: ["Priority_Degrees"],
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export default offlineApi;
