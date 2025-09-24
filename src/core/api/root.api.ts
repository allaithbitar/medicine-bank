import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootStoreState } from "../store/root.store.types";
import type { TLogin } from "@/features/auth/types/auth.types";
import { authActions } from "../slices/auth/auth.slice";

// const baseUrl = "http://localhost:5000";

const baseUrl = `http://${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
}`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStoreState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootStoreState).auth.refreshToken;

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        body: { refreshToken },
        method: "POST",
      },
      api,
      args
    );
    if (refreshResult.error) {
      api.dispatch(authActions.logoutUser());
      // dispatch Logout
    } else {
      const loginData: TLogin = (refreshResult.data as any).data;
      api.dispatch(authActions.setUser(loginData));
      result = await baseQuery(args, api, extraOptions);
      // dispatch login
    }
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Cities",
    "Work-Areas",
    "Beneficiaries",
    "Employees",
    "Priority_Degrees",
    "Disclosures",
    "Disclosure_Ratings",
    "Disclosure_Rating",
    "Disclosure_Visits",
    "Disclosure_Visit",
    "Ratings",
    "Summary_Statistics",
    "Detailed_Statistics",
    "Medicines",
    "Beneficiary_Medicines",
    "Calendar_Appointments",
    "Disclosure_Appointments",
    "Date_Appointments",
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});

export const middleware = rootApi.middleware;

export default rootApi.reducer;
