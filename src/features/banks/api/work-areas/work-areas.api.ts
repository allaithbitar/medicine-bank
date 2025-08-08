// src/features/work-areas/api/work-areas.api.ts
import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type {
  TArea,
  TAddWorkAreaPayload,
  TUpdateWorkAreaPayload,
} from "../../types/work-areas.types";

export const workAreasApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkAreas: builder.query<
      TPaginatedResponse<TArea>,
      {
        cityId: string;
        name?: string | null;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: ({ cityId, ...params }) => ({
        url: "/areas",
        method: "GET",
        params: { cityId, ...params },
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TArea>>) =>
        res.data,
      providesTags: [{ type: "Work-areas" }],
    }),
    addWorkArea: builder.mutation<void, TAddWorkAreaPayload>({
      query: (data) => ({
        url: "/areas",
        method: "POST",
        body: data,
      }),
      transformResponse: () => {},
      invalidatesTags: [{ type: "Work-areas" }],
    }),
    updateWorkArea: builder.mutation<void, TUpdateWorkAreaPayload>({
      query: (data) => ({
        url: `/areas`,
        method: "PUT",
        body: data,
      }),
      transformResponse: () => {},
      invalidatesTags: [{ type: "Work-areas" }],
    }),
  }),
});

export default workAreasApi;
