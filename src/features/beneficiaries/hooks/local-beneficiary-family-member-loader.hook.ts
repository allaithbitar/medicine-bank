import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TFamilyMember } from '../types/beneficiary.types';

export const getLocalFamilyMember = async (id: string): Promise<TFamilyMember | null> => {
  const result = await localDb.selectFrom('family_members').selectAll().where('id', '=', id!).executeTakeFirst();
  return result || null;
};

export const useLocalBeneficiaryFamilyMemberLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_BENEFICIARY_FAMILY_MEMBER', id, forceOffline],
    queryFn: async () => getLocalFamilyMember(id || ''),
    enabled: isOffline && !!id,
  });
  return queryResult;
};
