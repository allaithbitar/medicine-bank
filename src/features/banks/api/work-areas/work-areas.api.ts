import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse } from '@/core/types/common.types';
import type { TArea, TAddWorkAreaPayload, TUpdateWorkAreaPayload } from '../../types/work-areas.types';

export const workAreasApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkAreas: builder.query<
      TPaginatedResponse<TArea>,
      {
        cityId?: string;
        name?: string | null;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: ({ cityId, ...params }) => ({
        url: '/areas',
        method: 'GET',
        params: { cityId, ...params },
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TArea>>) => res.data,
      providesTags: [{ type: 'Work-Areas' }],
    }),
    getWorkAreaById: builder.query<TArea, { id: string }>({
      query: ({ id }) => ({
        url: `/areas/${id}`,
        method: 'GET',
      }),
      providesTags: ['Work-Area'],
      transformResponse: (res: ApiResponse<TArea>) => res.data,
    }),
    addWorkArea: builder.mutation<void, TAddWorkAreaPayload>({
      query: (data) => ({
        url: '/areas',
        method: 'POST',
        body: data,
      }),
      transformResponse: () => {},
      invalidatesTags: [{ type: 'Work-Areas' }, 'Work-Area'],
    }),
    updateWorkArea: builder.mutation<void, TUpdateWorkAreaPayload>({
      query: (data) => ({
        url: `/areas`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: () => {},
      invalidatesTags: [{ type: 'Work-Areas' }, 'Work-Area'],
    }),
  }),
});

export default workAreasApi;
