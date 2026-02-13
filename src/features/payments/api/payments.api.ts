import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse } from '@/core/types/common.types';
import type {
  TGetEligiblePaymentsDto,
  TGetPaymentHistoryDto,
  TMarkAsPaidDto,
  TPaymentEligibleItem,
  TPaymentHistoryItem,
} from '../types/payment.types';

export const paymentsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEligiblePayments: builder.infiniteQuery<
      TPaginatedResponse<TPaymentEligibleItem>,
      TGetEligiblePaymentsDto,
      number
    >({
      query: ({ queryArg, pageParam }) => ({
        url: 'payments/get-eligible',
        method: 'POST',
        body: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TPaymentEligibleItem>>) => res.data,
      providesTags: ['Payments_Eligible'],
    }),
    getPaymentHistory: builder.infiniteQuery<TPaginatedResponse<TPaymentHistoryItem>, TGetPaymentHistoryDto, number>({
      query: ({ queryArg, pageParam }) => ({
        url: 'payments/get-history',
        method: 'POST',
        body: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize ? undefined : lastPage.pageNumber + 1,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TPaymentHistoryItem>>) => res.data,
      providesTags: ['Payments_History'],
    }),
    markAsPaid: builder.mutation<void, TMarkAsPaidDto>({
      query: (payload) => ({
        url: 'payments/mark-as-paid',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Payments_Eligible', 'Payments_History'],
    }),
  }),
});

export default paymentsApi;
