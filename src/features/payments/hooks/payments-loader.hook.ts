import paymentsApi from '../api/payments.api';
import type { TGetEligiblePaymentsDto, TGetPaymentHistoryDto } from '../types/payment.types';

export const useEligiblePaymentsLoader = (dto: TGetEligiblePaymentsDto) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching, isLoading, error } =
    paymentsApi.useGetEligiblePaymentsInfiniteQuery(dto);
  return {
    items: data?.pages.map((p) => p.items).flat() ?? [],
    totalCount: data?.pages[0]?.totalCount ?? 0,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    error,
  };
};

export const usePaymentHistoryLoader = (dto: TGetPaymentHistoryDto) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching, isLoading, error } =
    paymentsApi.useGetPaymentHistoryInfiniteQuery(dto);
  return {
    items: data?.pages.map((p) => p.items).flat() ?? [],
    totalCount: data?.pages[0]?.totalCount ?? 0,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    error,
  };
};
