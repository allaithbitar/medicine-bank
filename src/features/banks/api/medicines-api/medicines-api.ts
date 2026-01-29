import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse } from '@/core/types/common.types';
import type {
  TAddMedicinePayload,
  TGetMedicinesDto,
  TMedicine,
  TUpdateMedicinePayload,
} from '../../types/medicines.types';

export const medicinesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicines: builder.infiniteQuery<TPaginatedResponse<TMedicine>, TGetMedicinesDto | undefined, number>({
      query: ({ queryArg, pageParam }) => ({
        url: '/medicines',
        method: 'GET',
        params: { ...queryArg, pageNumber: pageParam },
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TMedicine>>) => res.data,
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      providesTags: [{ type: 'Medicines', id: 'LIST' }],
    }),
    getMedicineById: builder.query<TMedicine, { id: string }>({
      query: ({ id }) => ({
        url: `/medicines/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, args) => [{ type: 'Medicine', id: args.id }],
      transformResponse: (res: ApiResponse<TMedicine>) => res.data,
    }),

    addMedicine: builder.mutation<TMedicine, TAddMedicinePayload>({
      query: (data) => ({
        url: '/medicines',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Medicines', id: 'LIST' }, 'Medicine'],
    }),

    updateMedicine: builder.mutation<void, TUpdateMedicinePayload>({
      query: (data) => ({
        url: `/medicines`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Medicines', id: 'LIST' }, 'Medicine'],
    }),
  }),
});

export default medicinesApi;
