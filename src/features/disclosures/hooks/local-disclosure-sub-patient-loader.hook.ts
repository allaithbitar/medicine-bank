import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const useLocalDisclosureSubPatientLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  return useQuery({
    queryKey: ['LOCAL_DISCLOSURE_SUB_PATIENT', id, forceOffline],
    queryFn: async () => {
      return await localDb
        .selectFrom('disclosure_sub_patients')
        .selectAll()
        .where('id', '=', id!)
        .executeTakeFirstOrThrow();
    },
    enabled: isOffline && !!id,
  });
};
