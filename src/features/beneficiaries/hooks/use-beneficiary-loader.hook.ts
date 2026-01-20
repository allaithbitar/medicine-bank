import useIsOffline from '@/core/hooks/use-is-offline.hook';
import beneficiaryApi from '../api/beneficiary.api';
import { useLocalBeneficiaryLoader } from './local-beneficiary.loader';

export const useBeneficiaryLoader = ({ id }: { id: string }) => {
  const isOffline = useIsOffline();

  const onlineQueryResult = beneficiaryApi.useGetBeneficiaryQuery({ id }, { skip: !id || isOffline });

  const offlineQueryResult = useLocalBeneficiaryLoader({ id });

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};