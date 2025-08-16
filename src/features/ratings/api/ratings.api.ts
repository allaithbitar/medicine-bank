import { rootApi } from "@/core/api/root.api";

import type { ApiResponse } from "@/core/types/common.types";
import type {
  TAddRatingDto,
  TGetRatingsDto,
  TRating,
  TUpdateRatingDto,
} from "../types/rating.types";

export const ratingsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query<TRating[], TGetRatingsDto>({
      query: (data) => ({
        url: "ratings",
        params: data,
      }),
      providesTags: ["Ratings"],
      transformResponse: (res: ApiResponse<TRating[]>) => res.data,
    }),

    addRating: builder.mutation<void, TAddRatingDto>({
      query: (data) => ({
        url: "rating",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ratings"],
    }),

    updateRating: builder.mutation<void, TUpdateRatingDto>({
      query: (data) => ({
        url: "ratings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Ratings"],
    }),
  }),
});

export default ratingsApi;
