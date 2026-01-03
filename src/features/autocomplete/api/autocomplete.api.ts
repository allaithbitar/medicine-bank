import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TAutocompleteItem,
  TPaginatedResponse,
} from "@/core/types/common.types";

type TAutocompleteDto = { query?: string; columns?: Record<string, boolean> };

const autocompleteApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    patientsAutocomplete: builder.query<
      TPaginatedResponse<TAutocompleteItem>,
      TAutocompleteDto
    >({
      query: (data) => ({
        url: "autocomplete/patients",
        body: data,
        method: "POST",
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>,
      ) => res.data,
      providesTags: ["Beneficiaries_Autocomplete"],
    }),
    employeesAutocomplete: builder.query<
      TPaginatedResponse<TAutocompleteItem>,
      TAutocompleteDto & { role?: string[] }
    >({
      query: (data) => ({
        url: "autocomplete/employees",
        body: data,
        method: "POST",
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>,
      ) => res.data,
      providesTags: ["Employees_Autocomplete"],
    }),
    citiesAutocomplete: builder.query<
      TPaginatedResponse<TAutocompleteItem>,
      TAutocompleteDto
    >({
      query: (data) => ({
        url: "autocomplete/cities",
        body: data,
        method: "POST",
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>,
      ) => res.data,
      providesTags: ["Cities_Autocomplete"],
    }),
    areasAutocomplete: builder.query<
      TPaginatedResponse<TAutocompleteItem>,
      TAutocompleteDto & { cityId?: string }
    >({
      query: (data) => ({
        url: "autocomplete/areas",
        body: data,
        method: "POST",
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>,
      ) => res.data,
      providesTags: ["Areas_Autocomplete"],
    }),
  }),
});

export default autocompleteApi;
