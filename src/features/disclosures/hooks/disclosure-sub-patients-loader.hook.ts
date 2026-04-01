import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureSubPatientsLoader } from '../hooks/local-disclosure-sub-patients-loader.hook';

export const useDisclosureSubPatientsLoader = (disclosureId?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureSubPatientsQuery(
    { disclosureId: disclosureId! },
    { skip: !disclosureId || isOffline }
  );

  const offlineQueryResult = useLocalDisclosureSubPatientsLoader(disclosureId, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
