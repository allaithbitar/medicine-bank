// src/features/cities/api/cities.api.ts
import { rootApi } from "@/core/api/root.api";
import type { ApiResponse } from "@/core/types/common.types";
import type {
  TAddCityPayload,
  TCity,
  TUpdateCityPayload,
} from "../../types/city.types";

export const citiesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<TCity[], { name: string | null }>({
      query: (params) => ({
        url: "/cities",
        method: "GET",
        params,
      }),
      transformResponse: (res: ApiResponse<TCity[]>) => res.items,
      providesTags: [{ type: "cities", id: "LIST" }],
    }),

    addCity: builder.mutation<TCity, TAddCityPayload>({
      query: (data) => ({
        url: "/cities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "cities", id: "LIST" }],
    }),

    updateCity: builder.mutation<void, TUpdateCityPayload>({
      query: (data) => ({
        url: `/cities`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "cities", id: "list" }],
    }),
  }),
});

export default citiesApi;
