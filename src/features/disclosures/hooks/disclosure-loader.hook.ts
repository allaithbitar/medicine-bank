import useIsOffline from '@/core/hooks/use-is-offline.hook';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureLoader } from './local-disclosure-loader.hook';
// import { useLocalDisclosureLoader } from "./local-disclosure.loader";

export const useDisclosureLoader = ({ id }: { id: string }, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();

  const onlineQueryResult = disclosuresApi.useGetDisclosureQuery({ id }, { skip: !id || isOffline });

  const offlineQueryResult = useLocalDisclosureLoader({ id }, forceOffline);

  return {
    data: isOffline ? offlineQueryResult.data : onlineQueryResult.data,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };

  // return {
  //   data: onlineQueryResult.data,
  //   isFetching: onlineQueryResult.isFetching,
  //   isLoading: onlineQueryResult.isLoading,
  //   error: onlineQueryResult.error,
  // };
};
