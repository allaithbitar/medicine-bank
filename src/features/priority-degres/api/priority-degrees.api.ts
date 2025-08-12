import { rootApi } from "@/core/api/root.api";

import type { ApiResponse } from "@/core/types/common.types";
import type {
  TAddPriorityDegreeDto,
  TGetPriorityDegreesDto,
  TPriorityDegree,
  TUpdatePriorityDegreeDto,
} from "../types/priority-degree.types";

export const priorityDegreesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPriorityDegrees: builder.query<
      TPriorityDegree[],
      TGetPriorityDegreesDto
    >({
      query: (data) => ({
        url: "priority-degrees",
        params: data,
      }),
      providesTags: ["Priority_Degrees"],
      transformResponse: (res: ApiResponse<TPriorityDegree[]>) => res.data,
    }),

    addPriorityDegree: builder.mutation<void, TAddPriorityDegreeDto>({
      query: (data) => ({
        url: "priority-degrees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Priority_Degrees"],
    }),

    updatePriorityDegree: builder.mutation<void, TUpdatePriorityDegreeDto>({
      query: (data) => ({
        url: "priority-degrees",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Priority_Degrees"],
    }),
  }),
});

export default priorityDegreesApi;
