import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const useLocalDisclosureDetailsLoader = (disclosureId?: string) => {
  console.log({ disclosureId });

  const isOffline = useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_DISCLOSURE_DETAILS', disclosureId],
    queryFn: async () => {
      return await localDb
        .selectFrom('disclosure_details')
        .selectAll()
        .where('disclosureId', '=', disclosureId!)
        .executeTakeFirstOrThrow();
    },
    enabled: isOffline && !!disclosureId,
  });
  return queryResult;
};
