import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type {
  TAddDisclosureDto,
  TDisclosure,
  TDisclosureRating,
  TDisclosureVisit,
  TGetDisclosureRatingsDto,
  TGetDisclosureVisitsDto,
  TSearchDislosureDto,
  TUpdateDisclosureDto,
} from "../types/disclosure.types";

export const disclosuresApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclosures: builder.query<
      TPaginatedResponse<TDisclosure>,
      TSearchDislosureDto
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
    getDisclosureVisits: builder.query<
      TPaginatedResponse<TDisclosureVisit>,
      TGetDisclosureVisitsDto
    >({
      query: (payload) => ({
        url: "disclosures/visits",
        params: payload,
      }),
      providesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Ratings" },
      ],
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TDisclosureVisit>>,
      ) => res.data,
    }),
  }),
});

export default disclosuresApi;
