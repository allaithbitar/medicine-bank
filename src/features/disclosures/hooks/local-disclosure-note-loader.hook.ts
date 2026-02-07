import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const useLocalDisclosureNoteLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_DISCLOSURE_NOTE', id, forceOffline],
    queryFn: async () => {
      return await localDb.selectFrom('disclosure_notes').selectAll().where('id', '=', id!).executeTakeFirstOrThrow();
    },
    enabled: isOffline && !!id,
  });
  return queryResult;
};
