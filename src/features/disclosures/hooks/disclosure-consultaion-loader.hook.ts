import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureConsultationLoader } from './local-disclosure-consultaion-loader.hook';

export const useDisclosureConsultationLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureAdviserConsultationByIdQuery(
    {
      id: id!,
    },
    {
      skip: !id || isOffline,
    }
  );

  const offlineQueryResult = useLocalDisclosureConsultationLoader(id, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
