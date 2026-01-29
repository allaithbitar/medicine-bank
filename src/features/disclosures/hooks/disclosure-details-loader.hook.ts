import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureDetailsLoader } from './local-disclosure-details-loader.hook';

export const useDisclosureDetailsLoader = (disclosureId?: string) => {
  const isOffline = useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureDetailsQuery(
    { disclosureId: disclosureId! },
    { skip: !disclosureId || isOffline }
  );

  const offlineQueryResult = useLocalDisclosureDetailsLoader(disclosureId!);
  console.log({ offlineQueryResult });

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
