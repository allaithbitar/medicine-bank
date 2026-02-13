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
  TGetDisclosureNotesDto,
  TGetDisclosureRatingsDto,
  TGetDisclosureVisitsDto,
  TGetDisclosuresDto,
  TUpdateDisclosureDetailsDto,
  TUpdateDisclosureDto,
  TUpdateDisclosureNotePayload,
  TUpdateDisclosureVisitDto,
  TGetDateAppointmentsDto,
  TUpdateDisclosureAdviserConsultationPayload,
  TMoveDisclosuresDto,
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

    addDisclosure: builder.mutation<{ id: string }, TAddDisclosureDto>({
      query: (payload) => ({
        url: 'disclosures',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (res: ApiResponse<{ id: string }>) => res.data,
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
    getDisclosureNotes: builder.infiniteQuery<TPaginatedResponse<TDisclosureNote>, TGetDisclosureNotesDto, number>({
      query: ({ pageParam, queryArg }) => ({
        url: '/disclosures/notes',
        method: 'GET',
        params: { ...queryArg, pageNumber: pageParam },
      }),

      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosureNote>>) => res.data,
      providesTags: () => [{ type: 'Disclosure_Notes', id: 'LIST' }],
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
      query: ({ disclosureId, noteAudio, noteText }: TAddDisclosureNotePayload) => {
        const formData = new FormData();
        formData.append('disclosureId', disclosureId);
        if (noteText && noteText.trim().length > 0) formData.append('noteText', noteText.trim());
        if (noteAudio && noteAudio instanceof Blob) {
          // fd.append('deleteAudioFile', 'false');
          formData.append('audioFile', noteAudio, `audio-${Date.now()}.webm`);
        }
        // else {
        //   fd.append('deleteAudioFile', 'true');
        // }
        // if (oldNote) {
        //   fd.append('id', oldNote.id);
        //   await updateDisclosureNote(fd).unwrap();
        //   notifySuccess(STRINGS.edited_successfully);
        // } else {
        //   await addDisclosureNote(fd).unwrap();
        //   notifySuccess(STRINGS.added_successfully);
        // }
        // navigate(-1);

        return {
          url: '/disclosures/notes',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Disclosure_Notes', id: 'LIST' }, 'Disclosure_Note'],
    }),
    updateDisclosureNote: builder.mutation<void, Omit<TUpdateDisclosureNotePayload, 'createdBy'>>({
      query: ({ id, disclosureId, noteAudio, noteText }) => {
        const formData = new FormData();
        formData.append('disclosureId', disclosureId);
        formData.append('id', id);

        if (noteText && noteText.trim().length > 0) formData.append('noteText', noteText.trim());

        if (noteAudio && noteAudio instanceof Blob) {
          formData.append('audioFile', noteAudio, `audio-${Date.now()}.webm`);
          formData.append('deleteAudioFile', 'true');
        }

        return {
          url: '/disclosures/notes',
          method: 'PUT',
          body: formData,
        };
      },
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
      query: ({ disclosureId, consultationNote, consultationAudio }) => {
        const formData = new FormData();
        formData.append('disclosureId', disclosureId);
        if (consultationNote && consultationNote.trim().length > 0)
          formData.append('consultationNote', consultationNote.trim());
        if (consultationAudio && consultationAudio instanceof Blob) {
          const name = `audio-${Date.now()}.webm`;
          formData.append('consultationAudioFile', consultationAudio, name);
        }
        return {
          url: '/disclosures/consultations',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Disclosure_Adviser_Consultations', id: 'LIST' }, 'Disclosure_Adviser_Consultation'],
    }),

    updateDisclosureAdviserConsultation: builder.mutation<void, TUpdateDisclosureAdviserConsultationPayload>({
      query: ({ id, disclosureId, consultationNote, consultationAudio }) => {
        const formData = new FormData();
        formData.append('disclosureId', disclosureId);
        formData.append('id', id);
        if (consultationNote && consultationNote.trim().length > 0)
          formData.append('consultationNote', consultationNote.trim());
        if (consultationAudio && consultationAudio instanceof Blob) {
          const name = `audio-${Date.now()}.webm`;
          formData.append('consultationAudioFile', consultationAudio, name);
          formData.append('deleteAudioFile', 'true');
        }
        return {
          url: '/disclosures/consultations',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_, __, arg: any) => [
        { type: 'Disclosure_Adviser_Consultations', id: 'LIST' },
        { type: 'Disclosure_Adviser_Consultations', id: arg.id },
        'Disclosure_Adviser_Consultation',
      ],
    }),

    getDisclosureAdviserConsultations: builder.infiniteQuery<
      TPaginatedResponse<TDisclosureAdviserConsultation>,
      TGetDisclosureAdviserConsultationParams,
      number
    >({
      query: ({ queryArg, pageParam }) => ({
        url: '/disclosures/consultations',
        method: 'GET',
        params: { ...queryArg, pageNumber: pageParam },
      }),

      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
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

    archiveDisclosure: builder.mutation<void, { id: string }>({
      query: (body) => ({
        url: '/disclosures/archive',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, args) => [{ id: args.id, type: 'Disclosures' }, 'Disclosures'],
    }),

    unarchiveDisclosure: builder.mutation<void, { id: string }>({
      query: (body) => ({
        url: '/disclosures/unarchive',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, args) => [{ id: args.id, type: 'Disclosures' }, 'Disclosures'],
    }),

    moveDisclosures: builder.mutation<void, TMoveDisclosuresDto>({
      query: (payload) => ({
        url: '/disclosures/move',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Disclosures'],
    }),
  }),
});

export default disclosuresApi;
