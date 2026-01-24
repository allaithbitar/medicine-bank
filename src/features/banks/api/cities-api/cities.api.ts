import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse, TPaginationDto } from '@/core/types/common.types';
import type { TAddCityPayload, TCity, TUpdateCityPayload } from '../../types/city.types';

export const citiesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.infiniteQuery<TPaginatedResponse<TCity>, { name?: string | null } & TPaginationDto, number>({
      query: ({ queryArg, pageParam }) => ({
        url: '/cities',
        method: 'GET',
        params: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TCity>>) => res.data,
      providesTags: [{ type: 'Cities', id: 'LIST' }],
    }),
    getCityById: builder.query<TCity, { id: string }>({
      query: ({ id }) => ({
        url: `/cities/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<TCity>) => res.data,
    }),
    addCity: builder.mutation<TCity, TAddCityPayload>({
      query: (data) => ({
        url: '/cities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Cities', id: 'LIST' }],
    }),

    updateCity: builder.mutation<void, TUpdateCityPayload>({
      query: (data) => ({
        url: `/cities`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Cities', id: 'LIST' }],
    }),
  }),
});

export default citiesApi;
