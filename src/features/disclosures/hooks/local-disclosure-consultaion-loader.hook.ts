import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';
import { withCreatedBy } from '@/libs/kysely/helpers';
import type { TDisclosureAdviserConsultation } from '../types/disclosure.types';

export const useLocalDisclosureConsultationLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_DISCLOSURE_CONSULTATION', id, forceOffline],
    queryFn: async () => {
      const result = await localDb
        .selectFrom('disclosure_consultations')
        .selectAll()
        .select((eb) => [
          jsonObjectFrom(
            eb
              .selectFrom('disclosures')
              .select(['disclosures.id', 'ratingId'])
              .select((ieb) => [
                jsonObjectFrom(
                  ieb
                    .selectFrom('ratings')
                    .select(['ratings.id', 'ratings.name', 'ratings.code'])
                    .whereRef('disclosures.ratingId', '=', 'ratings.id')
                ).as('rating'),
              ])
              .whereRef('disclosures.id', '=', 'disclosure_consultations.disclosureId')
          ).as('disclosure'),
          withCreatedBy(eb, 'disclosure_consultations.createdBy'),
        ])
        .where('id', '=', id!)
        .executeTakeFirstOrThrow();

      return result as unknown as TDisclosureAdviserConsultation;
    },
    enabled: isOffline && !!id,
  });
  return queryResult;
};
