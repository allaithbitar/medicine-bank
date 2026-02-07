import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const useLocalBeneficiaryFamilyMemberLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_BENEFICIARY_FAMILY_MEMBER', id, forceOffline],
    queryFn: async () => {
      return await localDb.selectFrom('family_members').selectAll().where('id', '=', id!).executeTakeFirstOrThrow();
    },
    enabled: isOffline && !!id,
  });
  return queryResult;
};
