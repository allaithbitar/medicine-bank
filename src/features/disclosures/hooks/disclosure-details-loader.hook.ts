import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureDetailsLoader } from './local-disclosure-details-loader.hook';

export const useDisclosureDetailsLoader = (disclosureId?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureDetailsQuery(
    { disclosureId: disclosureId! },
    { skip: !disclosureId || isOffline }
  );

  const offlineQueryResult = useLocalDisclosureDetailsLoader(disclosureId!, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
