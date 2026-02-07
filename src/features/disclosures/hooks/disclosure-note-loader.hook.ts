import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureNoteLoader } from './local-disclosure-note-loader.hook';

export const useDisclosureNoteLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureNoteByIdQuery(id!, { skip: !id || isOffline });

  const offlineQueryResult = useLocalDisclosureNoteLoader(id, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
