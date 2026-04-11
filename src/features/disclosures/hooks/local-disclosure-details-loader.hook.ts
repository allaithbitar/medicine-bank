import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { withCreatedBy, withUpdatedBy } from '@/libs/kysely/helpers';
import type { TDisclosureDetails } from '../types/disclosure.types';

export const useLocalDisclosureDetailsLoader = (disclosureId?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_DISCLOSURE_PROPERTIES', disclosureId, forceOffline],
    queryFn: async () => {
      const result = (await localDb
        .selectFrom('disclosure_properties')
        .selectAll()
        .select((eb) => [
          withCreatedBy(eb, 'createdBy'),
          withUpdatedBy(eb, 'updatedBy'),
        ])
        .where('disclosureId', '=', disclosureId!)
        .executeTakeFirst()) as TDisclosureDetails | null;

      return result || null;
    },
    enabled: isOffline && !!disclosureId,
  });
  return queryResult;
};
