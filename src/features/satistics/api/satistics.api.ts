import { rootApi } from "@/core/api/root.api";

import type { ApiResponse } from "@/core/types/common.types";
import type {
  TDetailedReportResult,
  TGetSatisticsDto,
  TSummaryReportResult,
} from "../types/satistics.types";

export const satisticsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummarySatistics: builder.query<TSummaryReportResult, TGetSatisticsDto>({
      query: (data) => ({
        url: "satistics/get-summary-satistics",
        body: data,
        method: "POST",
      }),
      providesTags: ["Summary_Satistics"],
      transformResponse: (res: ApiResponse<TSummaryReportResult>) => res.data,
    }),
    getDetailedSatistics: builder.query<
      TDetailedReportResult,
      TGetSatisticsDto
    >({
      query: (data) => ({
        url: "satistics/get-detailed-satistics",
        body: data,
        method: "POST",
      }),
      providesTags: ["Detailed_Satistics"],
      transformResponse: (res: ApiResponse<TDetailedReportResult>) => res.data,
    }),
  }),
});

export default satisticsApi;
