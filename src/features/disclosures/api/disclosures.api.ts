import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type {
  TAddDisclosureDto,
  TAddDisclosureRatingDto,
  TAddDisclosureVisitDto,
  TDisclosure,
  TDisclosureRating,
  TDisclosureVisit,
  TGetDisclosureRatingsDto,
  TGetDisclosureVisitsDto,
  TGetDisclosuresDto,
  TUpdateDisclosureDto,
  TUpdateDisclosureRatingDto,
  TUpdateDisclosureVisitDto,
} from "../types/disclosure.types";

export const disclosuresApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclosures: builder.query<
      TPaginatedResponse<TDisclosure>,
      TGetDisclosuresDto
    >({
      query: (payload) => ({
        url: "disclosures/search",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosure>>) =>
        res.data,
      providesTags: ["Disclosures"],
    }),

    addDisclosure: builder.mutation<void, TAddDisclosureDto>({
      query: (payload) => ({
        url: "disclosures",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Disclosures"],
    }),

    updateDisclosure: builder.mutation<void, TUpdateDisclosureDto>({
      query: (payload) => ({
        url: "disclosures",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Disclosures"],
    }),

    getDisclosure: builder.query<TDisclosure, { id: string }>({
      query: ({ id }) => ({
        url: `disclosures/${id}`,
      }),
      providesTags: (_, __, args) => [{ id: args.id, type: "Disclosures" }],
      transformResponse: (res: ApiResponse<TDisclosure>) => res.data,
    }),

    getDisclosureRatings: builder.query<
      TPaginatedResponse<TDisclosureRating>,
      TGetDisclosureRatingsDto
    >({
      query: (payload) => ({
        url: "disclosures/ratings",
        params: payload,
      }),
      providesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Ratings" },
      ],
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TDisclosureRating>>,
      ) => res.data,
    }),

    getDisclosureRating: builder.query<TDisclosureRating, { id: string }>({
      query: ({ id }) => ({
        url: `disclosures/ratings/${id}`,
      }),
      providesTags: (_, __, args) => [
        { id: args.id, type: "Disclosure_Rating" },
      ],
      transformResponse: (res: ApiResponse<TDisclosureRating>) => res.data,
    }),

    addDisclosureRating: builder.mutation<void, TAddDisclosureRatingDto>({
      query: (payload) => ({
        url: "disclosures/ratings",
        body: payload,
        method: "POST",
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Ratings" },
      ],
    }),

    updateDisclosureRating: builder.mutation<void, TUpdateDisclosureRatingDto>({
      query: (payload) => ({
        url: "disclosures/ratings",
        body: payload,
        method: "PUT",
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Ratings" },
        { id: args.id, type: "Disclosure_Rating" },
      ],
    }),

    getDisclosureVisits: builder.query<
      TPaginatedResponse<TDisclosureVisit>,
      TGetDisclosureVisitsDto
    >({
      query: (payload) => ({
        url: "disclosures/visits",
        params: payload,
      }),
      providesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Visits" },
      ],
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TDisclosureVisit>>,
      ) => res.data,
    }),
    getDisclosureVisit: builder.query<TDisclosureVisit, { id: string }>({
      query: ({ id }) => ({
        url: `disclosures/visits/${id}`,
      }),
      providesTags: (_, __, args) => [
        { id: args.id, type: "Disclosure_Visit" },
      ],
      transformResponse: (res: ApiResponse<TDisclosureVisit>) => res.data,
    }),

    addDisclosureVisit: builder.mutation<void, TAddDisclosureVisitDto>({
      query: (payload) => ({
        url: "disclosures/visits",
        body: payload,
        method: "POST",
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Visits" },
      ],
    }),

    updateDisclosureVisit: builder.mutation<void, TUpdateDisclosureVisitDto>({
      query: (payload) => ({
        url: "disclosures/visits",
        body: payload,
        method: "PUT",
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Visits" },
        { id: args.id, type: "Disclosure_Visit" },
      ],
    }),
  }),
});

export default disclosuresApi;
