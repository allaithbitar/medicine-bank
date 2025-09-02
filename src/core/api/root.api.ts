import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootStoreState } from "../store/root.store.types";

// const baseUrl = "http://localhost:5000";

const baseUrl = `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;

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
  tagTypes: [
    "Auth",
    "cities",
    "Work-areas",
    "Beneficiaries",
    "Employees",
    "Priority_Degrees",
    "Disclosures",
    "Disclosure_Ratings",
    "Disclosure_Rating",
    "Disclosure_Visits",
    "Disclosure_Visit",
    "Ratings",
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});

export const middleware = rootApi.middleware;

export default rootApi.reducer;
