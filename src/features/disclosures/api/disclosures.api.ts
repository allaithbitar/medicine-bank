import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse } from '@/core/types/common.types';
import type {
  TAddDisclosureAdviserConsultationPayload,
  TAddDisclosureDetailsDto,
  TAddDisclosureDto,
  TAddDisclosureNotePayload,
  TAddDisclosureVisitDto,
  TAuditDetailsRow,
  TAuditGroup,
  TDisclosure,
  TDisclosureAdviserConsultation,
  TAppointmentsResponse,
  TDisclosureDetails,
  TDisclosureNote,
  TDisclosureRating,
  TDisclosureVisit,
  TGetDisclosureAdviserConsultationParams,
  TGetDisclosureAppointmentsDto,
  TGetDisclosureNotesParams,
  TGetDisclosureRatingsDto,
  TGetDisclosureVisitsDto,
  TGetDisclosuresDto,
  TUpdateDisclosureDetailsDto,
  TUpdateDisclosureDto,
  TUpdateDisclosureNotePayload,
  TUpdateDisclosureVisitDto,
  TGetDateAppointmentsDto,
} from '../types/disclosure.types';

export const disclosuresApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclosures: builder.infiniteQuery<TPaginatedResponse<TDisclosure>, TGetDisclosuresDto, number>({
      query: ({ queryArg, pageParam }) => ({
        url: 'disclosures/search',
        method: 'POST',
        body: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosure>>) => res.data,
      providesTags: ['Disclosures'],
    }),

    addDisclosure: builder.mutation<void, TAddDisclosureDto>({
      query: (payload) => ({
        url: 'disclosures',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Disclosures'],
    }),

    updateDisclosure: builder.mutation<void, TUpdateDisclosureDto>({
      query: (payload) => ({
        url: 'disclosures',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Disclosures', 'Disclosure_Appointments'],
    }),

    getDisclosure: builder.query<TDisclosure, { id: string }>({
      query: ({ id }) => ({
        url: `disclosures/${id}`,
      }),
      providesTags: (_, __, args) => [{ id: args.id, type: 'Disclosures' }],
      transformResponse: (res: ApiResponse<TDisclosure>) => res.data,
    }),

    getLastDisclosure: builder.query<TDisclosure, { patientId: string }>({
      query: ({ patientId }) => ({
        url: `/disclosures/last/${patientId}`,
      }),
      providesTags: ['Disclosures'],
      transformResponse: (res: TDisclosure) => res,
    }),

    getDisclosureRatings: builder.query<TPaginatedResponse<TDisclosureRating>, TGetDisclosureRatingsDto>({
      query: (payload) => ({
        url: 'disclosures/ratings',
        params: payload,
      }),
      providesTags: (_, __, args) => [{ id: args.disclosureId, type: 'Disclosure_Ratings' }],
      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosureRating>>) => res.data,
    }),

    getDisclosureRating: builder.query<TDisclosureRating, { id: string }>({
      query: ({ id }) => ({
        url: `disclosures/ratings/${id}`,
      }),
      providesTags: (_, __, args) => [{ id: args.id, type: 'Disclosure_Rating' }],
      transformResponse: (res: ApiResponse<TDisclosureRating>) => res.data,
    }),

    addDisclosureRating: builder.mutation<void, any>({
      query: (payload) => ({
        url: 'disclosures/ratings',
        body: payload,
        method: 'POST',
      }),
      invalidatesTags: (_, __, args) => [{ id: args.disclosureId, type: 'Disclosure_Ratings' }],
    }),

    updateDisclosureRating: builder.mutation<void, any>({
      query: (payload) => ({
        url: 'disclosures/ratings',
        body: payload,
        method: 'PUT',
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: 'Disclosure_Ratings' },
        { id: args.id, type: 'Disclosure_Rating' },
      ],
    }),

    getDisclosureVisits: builder.infiniteQuery<TPaginatedResponse<TDisclosureVisit>, TGetDisclosureVisitsDto, number>({
      query: ({ pageParam, queryArg }) => ({
        url: 'disclosures/visits',
        params: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.totalCount === 0 ? undefined : lastPage.pageNumber,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosureVisit>>) => res.data,
      providesTags: (_, __, args) => [{ id: args.disclosureId, type: 'Disclosure_Visits' }],
    }),
    getDisclosureVisit: builder.query<TDisclosureVisit, { id: string }>({
      query: ({ id }) => ({
        url: `disclosures/visits/${id}`,
      }),
      providesTags: (_, __, args) => [{ id: args.id, type: 'Disclosure_Visit' }],
      transformResponse: (res: ApiResponse<TDisclosureVisit>) => res.data,
    }),

    addDisclosureVisit: builder.mutation<void, TAddDisclosureVisitDto>({
      query: (payload) => ({
        url: 'disclosures/visits',
        body: payload,
        method: 'POST',
      }),
      invalidatesTags: (_, __, args) => [{ id: args.disclosureId, type: 'Disclosure_Visits' }],
    }),

    updateDisclosureVisit: builder.mutation<void, TUpdateDisclosureVisitDto>({
      query: (payload) => ({
        url: 'disclosures/visits',
        body: payload,
        method: 'PUT',
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: 'Disclosure_Visits' },
        { id: args.id, type: 'Disclosure_Visit' },
      ],
    }),
    getDisclosureNotes: builder.query<TPaginatedResponse<TDisclosureNote>, TGetDisclosureNotesParams>({
      query: (params) => ({
        url: '/disclosures/notes',
        method: 'GET',
        params,
      }),

      providesTags: () => [{ type: 'Disclosure_Notes', id: 'LIST' }],

      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosureNote>>) => res.data,
    }),
    getDisclosureNoteById: builder.query<TDisclosureNote, string>({
      query: (id) => ({
        url: `/disclosures/notes/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<TDisclosureNote>) => res.data,
      providesTags: ['Disclosure_Note'],
    }),

    addDisclosureNote: builder.mutation<TDisclosureNote, TAddDisclosureNotePayload>({
      query: (body) => ({
        url: '/disclosures/notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Disclosure_Notes', id: 'LIST' }, 'Disclosure_Note'],
    }),
    updateDisclosureNote: builder.mutation<void, Omit<TUpdateDisclosureNotePayload, 'createdBy'>>({
      query: (body) => ({
        url: '/disclosures/notes',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, arg: any) => [
        { type: 'Disclosure_Notes', id: 'LIST' },
        { type: 'Disclosure_Notes', id: arg.id },
        'Disclosure_Note',
      ],
    }),
    addDisclosureAdviserConsultation: builder.mutation<
      TDisclosureAdviserConsultation,
      TAddDisclosureAdviserConsultationPayload
    >({
      query: (body) => ({
        url: '/disclosures/consultations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Disclosure_Adviser_Consultations', id: 'LIST' }, 'Disclosure_Adviser_Consultation'],
    }),

    updateDisclosureAdviserConsultation: builder.mutation<void, TUpdateDisclosureNotePayload>({
      query: (body) => ({
        url: '/disclosures/consultations',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, arg: any) => [
        { type: 'Disclosure_Adviser_Consultations', id: 'LIST' },
        { type: 'Disclosure_Adviser_Consultations', id: arg.id },
        'Disclosure_Adviser_Consultation',
      ],
    }),

    getDisclosureAdviserConsultations: builder.query<
      TPaginatedResponse<TDisclosureAdviserConsultation>,
      TGetDisclosureAdviserConsultationParams
    >({
      query: ({ consultationStatus, createdBy, disclosureId }) => ({
        url: '/disclosures/consultations',
        method: 'GET',
        params: {
          consultationStatus,
          createdBy,
          disclosureId,
        },
      }),

      providesTags: () => [{ type: 'Disclosure_Adviser_Consultations', id: 'LIST' }],

      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosureAdviserConsultation>>) => res.data,
    }),

    getDisclosureAdviserConsultationById: builder.query<TDisclosureAdviserConsultation, { id: string }>({
      query: ({ id }) => ({
        url: `/disclosures/consultations/${id}`,
        method: 'GET',
      }),
      providesTags: ['Disclosure_Adviser_Consultation'],
      transformResponse: (res: ApiResponse<TDisclosureAdviserConsultation>) => res.data,
    }),

    completeConsultation: builder.mutation<void, { id: string; ratingId: string }>({
      query: (body) => ({ url: '/disclosures/consultations/complete', method: 'PUT', body }),
      invalidatesTags: [{ type: 'Disclosure_Adviser_Consultations', id: 'LIST' }, 'Disclosure_Adviser_Consultation'],
    }),

    getAuditLog: builder.query<TPaginatedResponse<TAuditGroup>, { disclosureId?: string | null }>({
      query: (params) => ({
        url: '/disclosures/audit-log',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TAuditGroup>>) => res.data,
      providesTags: [{ type: 'audit', id: 'LIST' }],
    }),
    getAuditDetails: builder.query<TAuditDetailsRow[], { disclosureId: string; date: string }>({
      query: (body) => ({
        url: '/disclosures/audit-log/details',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<TAuditDetailsRow[]>) => res.data,
    }),
    getAppointments: builder.query<TAppointmentsResponse, TGetDisclosureAppointmentsDto>({
      query: (params) => ({
        url: '/disclosures/appointments',
        params,
      }),
      transformResponse: (res: ApiResponse<TAppointmentsResponse>) => res.data,
      providesTags: ['Disclosure_Appointments'],
    }),
    getDateAppointments: builder.query<TDisclosure[], TGetDateAppointmentsDto>({
      query: (params) => ({
        url: '/disclosures/appointments/date',
        params,
      }),
      transformResponse: (res: ApiResponse<TDisclosure[]>) => res.data,
    }),

    getDisclosureDetails: builder.query<TDisclosureDetails, { disclosureId: string }>({
      query: ({ disclosureId }) => ({
        url: '/disclosures/details',
        method: 'GET',
        params: { disclosureId },
      }),
      providesTags: (_, __, args) => [{ id: args.disclosureId, type: 'Disclosure_Details' }],
      transformResponse: (res: ApiResponse<TDisclosureDetails>) => res.data,
    }),

    addDisclosureDetails: builder.mutation<void, TAddDisclosureDetailsDto>({
      query: (payload) => ({
        url: '/disclosures/details',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: 'Disclosure_Details' },
        { id: args.disclosureId, type: 'Disclosures' },
      ],
    }),

    updateDisclosureDetails: builder.mutation<void, TUpdateDisclosureDetailsDto>({
      query: (payload) => ({
        url: '/disclosures/details',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_, __, args) => [
        { id: args.disclosureId, type: 'Disclosure_Details' },
        { id: args.disclosureId, type: 'Disclosures' },
      ],
    }),
  }),
});

export default disclosuresApi;
