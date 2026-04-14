import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TDisclosureSubPatient } from '../types/disclosure.types';

export const getLocalDisclosureSubPatient = async (id: string): Promise<TDisclosureSubPatient | null> => {
  const result = await localDb
    .selectFrom('disclosure_sub_patients')
    .selectAll()
    .where('id', '=', id!)
    .executeTakeFirst();
  return result || null;
};

export const useLocalDisclosureSubPatientLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  return useQuery({
    queryKey: ['LOCAL_DISCLOSURE_SUB_PATIENT', id, forceOffline],
    queryFn: async () => getLocalDisclosureSubPatient(id || ''),
    enabled: isOffline && !!id,
  });
};
