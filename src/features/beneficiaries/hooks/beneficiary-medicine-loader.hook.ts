import useIsOffline from '@/core/hooks/use-is-offline.hook';

import beneficiaryApi from '../api/beneficiary.api';
import { useLocalBeneficiaryMedicineLoader } from './local-beneficiary-medicine-loader.hook';

export const useBeneficiaryMedicineLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = beneficiaryApi.useGetBeneficiaryMedicineByIdQuery(
    { id: id || '' },
    {
      skip: isOffline || !id,
    }
  );

  const offlineQueryResult = useLocalBeneficiaryMedicineLoader(id, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
