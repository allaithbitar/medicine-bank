import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type {
  TAddDisclosureDto,
  TAddDisclosureNotePayload,
  TAddDisclosureRatingDto,
  TAddDisclosureVisitDto,
  TDisclosure,
  TDisclosureNote,
  TDisclosureRating,
  TDisclosureVisit,
  TGetDisclosureNotesParams,
  TGetDisclosureRatingsDto,
  TGetDisclosureVisitsDto,
  TGetDisclosuresDto,
  TUpdateDisclosureDto,
  TUpdateDisclosureNotePayload,
  TUpdateDisclosureRatingDto,
  TUpdateDisclosureVisitDto,
} from "../types/disclosure.types";

export const disclosuresApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclosures: builder.infiniteQuery<
      TPaginatedResponse<TDisclosure>,
      TGetDisclosuresDto,
      number
    >({
      query: ({ queryArg, pageParam }) => ({
        url: "disclosures/search",
        method: "POST",
        body: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize
            ? undefined
            : lastPage.pageNumber + 1,
      },
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
        res: ApiResponse<TPaginatedResponse<TDisclosureRating>>
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

    getDisclosureVisits: builder.infiniteQuery<
      TPaginatedResponse<TDisclosureVisit>,
      TGetDisclosureVisitsDto,
      number
    >({
      query: ({ pageParam, queryArg }) => ({
        url: "disclosures/visits",
        params: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.totalCount === 0
            ? undefined
            : lastPage.pageNumber,
      },
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TDisclosureVisit>>
      ) => res.data,
      providesTags: (_, __, args) => [
        { id: args.disclosureId, type: "Disclosure_Visits" },
      ],
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
    getDisclosureNotes: builder.query<
      TPaginatedResponse<TDisclosureNote>,
      TGetDisclosureNotesParams
    >({
      query: (params) => ({
        url: "/disclosures/notes",
        method: "GET",
        params,
      }),

      providesTags: () => [{ type: "Disclosure_Notes", id: "LIST" }],

      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TDisclosureNote>>
      ) => res.data,
    }),
    getDisclosureNoteById: builder.query<TDisclosureNote, string>({
      query: (id) => ({
        url: `/disclosures/notes/${id}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<TDisclosureNote>) => res.data,
      providesTags: (_, __, id) => [{ type: "Disclosure_Notes", id }],
    }),

    addDisclosureNote: builder.mutation<
      TDisclosureNote,
      TAddDisclosureNotePayload
    >({
      query: (body) => ({
        url: "/disclosures/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Disclosure_Notes", id: "LIST" }],
    }),
    updateDisclosureNote: builder.mutation<
      void,
      Omit<TUpdateDisclosureNotePayload, "createdBy">
    >({
      query: (body) => ({
        url: "/disclosures/notes",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "Disclosure_Notes", id: "LIST" },
        { type: "Disclosure_Notes", id: arg.id },
      ],
    }),
  }),
});

export default disclosuresApi;
