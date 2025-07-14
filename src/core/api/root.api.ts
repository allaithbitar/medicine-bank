import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootStoreState } from "../store/root.store.types";

const baseUrl = "http://localhost:3000";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootStoreState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "cities", "Work-areas"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});

export const middleware = rootApi.middleware;

export default rootApi.reducer;
