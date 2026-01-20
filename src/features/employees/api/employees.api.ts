import { rootApi } from '@/core/api/root.api';

import type { TAddEmployeeDto, TEmployee, TSearchEmployeesDto, TUpdateEmployeeDto } from '../types/employee.types';
import type { ApiResponse, TPaginatedResponse } from '@/core/types/common.types';

export const employeesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // getEmployees: builder.query<TPaginatedResponse<TEmployee>, TSearchEmployeesDto>({
    //   query: (data) => ({
    //     url: 'employees/search',
    //     method: 'POST',
    //     body: data,
    //   }),
    //   providesTags: ['Employees'],
    //   transformResponse: (res: ApiResponse<TPaginatedResponse<TEmployee>>) => res.data,
    // }),
    getEmployees: builder.infiniteQuery<TPaginatedResponse<TEmployee>, TSearchEmployeesDto, number>({
      query: ({ queryArg, pageParam }) => ({
        url: 'employees/search',
        method: 'POST',
        body: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TEmployee>>) => res.data,
      providesTags: ['Employees'],
    }),

    getEmployee: builder.query<TEmployee, { id: string }>({
      query: ({ id }) => ({
        url: `employees/${id}`,
      }),
      providesTags: ['Employees'],
      transformResponse: (res: ApiResponse<TEmployee>) => res.data,
    }),

    addEmployee: builder.mutation<void, TAddEmployeeDto>({
      query: (data) => ({
        url: 'employees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employees'],
    }),

    updateEmployee: builder.mutation<void, TUpdateEmployeeDto>({
      query: (data) => ({
        url: 'employees',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Employees'],
    }),
  }),
});

export default employeesApi;
