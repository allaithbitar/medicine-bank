import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse, TPaginationDto } from '@/core/types/common.types';
import type { TNotification, TNotificationsPayload } from '../types/notifications.type';

export const notificationsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.infiniteQuery<
      TPaginatedResponse<TNotification>,
      TNotificationsPayload & TPaginationDto,
      number
    >({
      query: ({ queryArg, pageParam }) => ({
        url: '/notifications/search',
        method: 'POST',
        body: {
          pageSize: pageParam,
          ...queryArg,
        },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      providesTags: [{ type: 'notifications', id: 'SEARCH' }],
      transformResponse: (res: ApiResponse<TPaginatedResponse<TNotification>>) => res.data,
    }),
    getUnreadCount: builder.query<number, void>({
      query: () => ({ url: '/notifications/unread-count', method: 'GET' }),
      providesTags: [{ type: 'notifications', id: 'UNREAD_COUNT' }],
      transformResponse: (res: ApiResponse<number>) => res.data,
    }),
    getNotificationById: builder.query<TNotification, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: 'GET' }),
      transformResponse: (res: ApiResponse<TNotification>) => res.data,
    }),
    markNotificationRead: builder.mutation<void, { id: string }>({
      query: (body) => ({ url: '/notifications/mark-read', method: 'PUT', body }),
      invalidatesTags: [
        { type: 'notifications', id: 'UNREAD_COUNT' },
        { type: 'notifications', id: 'SEARCH' },
      ],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/mark-all-read', method: 'PUT' }),
      invalidatesTags: [
        { type: 'notifications', id: 'UNREAD_COUNT' },
        { type: 'notifications', id: 'SEARCH' },
      ],
    }),
    deleteReadNotifications: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/delete-read', method: 'PUT' }),
      invalidatesTags: [
        { type: 'notifications', id: 'UNREAD_COUNT' },
        { type: 'notifications', id: 'SEARCH' },
      ],
    }),
  }),
});
export default notificationsApi;
