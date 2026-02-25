import { rootApi } from "@/core/api/root.api";

import type { ApiResponse } from "@/core/types/common.types";
import type {
  TDetailedReportResult,
  TGetSatisticsDto,
  THalfDetailedByAreaResult,
  THalfDetailedStatisticsResult,
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
      providesTags: ["Summary_Statistics"],
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
      providesTags: ["Detailed_Statistics"],
      transformResponse: (res: ApiResponse<TDetailedReportResult>) => res.data,
    }),
    getHalfDetailedSatistics: builder.query<
      THalfDetailedStatisticsResult,
      TGetSatisticsDto
    >({
      query: (data) => ({
        url: "satistics/get-half-detailed-satistics",
        body: data,
        method: "POST",
      }),
      providesTags: ["HalfDetailed_Statistics"],
      transformResponse: (res: ApiResponse<THalfDetailedStatisticsResult>) =>
        res.data,
    }),
    getHalfDetailedByArea: builder.query<
      THalfDetailedByAreaResult,
      TGetSatisticsDto
    >({
      query: (data) => ({
        url: "satistics/get-half-detailed-by-area",
        body: data,
        method: "POST",
      }),
      providesTags: ["HalfDetailedByArea_Statistics"],
      transformResponse: (res: ApiResponse<THalfDetailedByAreaResult>) =>
        res.data,
    }),
  }),
});

export default satisticsApi;
