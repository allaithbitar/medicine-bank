import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse, TPaginationDto } from '@/core/types/common.types';
import type { TAddMeetingPayload, TMeeting } from '../types/meetings.types';

export type TUpdateMeetingPayload = TAddMeetingPayload & { id: string };

export const meetingsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.infiniteQuery<TPaginatedResponse<TMeeting>, TPaginationDto, number>({
      query: ({ queryArg, pageParam }) => ({
        url: '/meetings',
        method: 'GET',
        params: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TMeeting>>) => res.data,
      providesTags: () => [{ type: 'meetings', id: 'LIST' }],
    }),
    getMeetingsById: builder.query<TMeeting, { id: string }>({
      query: ({ id }) => ({
        url: `/meetings/${id}`,
        method: 'GET',
      }),
      providesTags: ['meeting'],
      transformResponse: (res: ApiResponse<TMeeting>) => res.data,
    }),
    addMeeting: builder.mutation<TMeeting, TAddMeetingPayload>({
      query: (body) => ({ url: '/meetings', method: 'POST', body }),
      invalidatesTags: [{ type: 'meetings', id: 'LIST' }, 'meeting'],
    }),

    updateMeeting: builder.mutation<void, TUpdateMeetingPayload>({
      query: (body) => ({ url: '/meetings', method: 'PUT', body }),
      invalidatesTags: (_, __, arg) => [{ type: 'meetings', id: 'LIST' }, { type: 'meetings', id: arg.id }, 'meeting'],
    }),
  }),
  overrideExisting: false,
});

export default meetingsApi;
