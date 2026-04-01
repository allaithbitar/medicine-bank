import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TDisclosureSubPatient } from '../types/disclosure.types';

export const useLocalDisclosureSubPatientsLoader = (disclosureId?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  return useQuery({
    queryKey: ['LOCAL_DISCLOSURE_SUB_PATIENTS', disclosureId, forceOffline],
    queryFn: async () => {
      const result = (await localDb
        .selectFrom('disclosure_sub_patients')
        .selectAll()
        .where('disclosureId', '=', disclosureId!)
        .execute()) as TDisclosureSubPatient[];
      return result;
    },
    enabled: isOffline && !!disclosureId,
  });
};
