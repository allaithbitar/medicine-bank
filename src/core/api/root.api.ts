import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootStoreState } from '../store/root.store.types';
import type { TLogin } from '@/features/auth/types/auth.types';
import { authActions } from '../slices/auth/auth.slice';

// export const baseUrl = "http://10.200.237.148:5000";

// Use HTTPS if enabled, otherwise fallback to HTTP
console.log(import.meta.env);

const protocol = import.meta.env.VITE_USE_HTTPS === 'true' ? 'https' : 'http';
export const baseUrl = `${protocol}://192.168.2.101:${import.meta.env.VITE_API_PORT}`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStoreState).auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootStoreState).auth.refreshToken;

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        body: { refreshToken },
        method: 'POST',
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
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'Cities',
    'Work-Areas',
    'Work-Area',
    'Beneficiaries',
    'Employees',
    'Priority_Degrees',
    'Disclosures',
    'Disclosure_Ratings',
    'Disclosure_Rating',
    'Disclosure_Visits',
    'Disclosure_Visit',
    'Ratings',
    'Summary_Statistics',
    'Detailed_Statistics',
    'Medicines',
    'Medicine',
    'Beneficiary_Medicines',
    'Beneficiary_Medicine',
    'Beneficiaries_Autocomplete',
    'Employees_Autocomplete',
    'Cities_Autocomplete',
    'Areas_Autocomplete',
    'Calendar_Appointments',
    'Disclosure_Appointment',
    'Disclosure_Appointments',
    'Date_Appointments',
    'family_Members',
    'system_Broadcasts',
    'system_Broadcast',
    'meetings',
    'meeting',
    'Disclosure_Notes',
    'Disclosure_Note',
    'audit',
    'Disclosure_Adviser_Consultations',
    'Disclosure_Adviser_Consultation',
    'Disclosure',
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});

export const middleware = rootApi.middleware;

export default rootApi.reducer;
