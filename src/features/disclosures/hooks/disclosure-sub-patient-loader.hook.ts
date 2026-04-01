import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureSubPatientLoader } from './local-disclosure-sub-patient-loader.hook';

export const useDisclosureSubPatientLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureSubPatientByIdQuery({ id: id! }, { skip: !id || isOffline });

  const offlineQueryResult = useLocalDisclosureSubPatientLoader(id, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
