import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import type { TDisclosure } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { ParseJSONResultsPlugin } from 'kysely';
import { withCreatedBy, withUpdatedBy } from '@/libs/kysely/helpers';
export const useLocalDisclosureLoader = ({ id }: { id: string }) => {
  const isOffline = true;
  const queryResult = useQuery({
    queryKey: ['LOCAL_DISCLOSURE', id],
    queryFn: async () => {
      const res = (await localDb
        .selectFrom('disclosures')
        .selectAll()
        .select((col) => [
          jsonObjectFrom(
            col
              .selectFrom('ratings')
              .select(['ratings.id', 'ratings.name', 'ratings.code', 'ratings.description'])
              .whereRef('ratings.id', '=', 'disclosures.ratingId')
          ).as('rating'),
          jsonObjectFrom(
            col
              .selectFrom('employees')
              .select(['employees.id', 'employees.name'])
              .whereRef('employees.id', '=', 'disclosures.scoutId')
          ).as('scout'),
          jsonObjectFrom(
            col
              .selectFrom('priority_degrees')
              .select(['priority_degrees.id', 'priority_degrees.name', 'priority_degrees.color'])
              .whereRef('priority_degrees.id', '=', 'disclosures.priorityId')
          ).as('priority'),
          jsonObjectFrom(
            col
              .selectFrom('patients')
              .select([
                'patients.id',
                'patients.name',
                'patients.nationalNumber',
                'patients.birthDate',
                'patients.gender',
                'patients.address',
                'patients.about',
                'patients.createdAt',
                'patients.updatedAt',
              ])
              .select((pcol) => [
                jsonArrayFrom(
                  pcol
                    .selectFrom('patients_phone_numbers')
                    .select(['patients_phone_numbers.id', 'patients_phone_numbers.phone'])
                    .whereRef('patients_phone_numbers.patientId', '=', 'patients.id')
                ).as('phones'),
                jsonObjectFrom(
                  pcol
                    .selectFrom('areas')
                    .select(['areas.id', 'areas.name'])
                    .whereRef('areas.id', '=', 'patients.areaId')
                ).as('area'),
              ])
              .whereRef('patients.id', '=', 'disclosures.patientId')
          ).as('patient'),
          withCreatedBy(col, 'createdBy'),
          withUpdatedBy(col, 'updatedBy'),
        ])

        .where('id', '=', id)
        .withPlugin(new ParseJSONResultsPlugin())
        .executeTakeFirstOrThrow(() => new Error(STRINGS.local_not_found_error))) as unknown as TDisclosure;

      return res;
    },
    enabled: isOffline && !!id,
  });
  return queryResult;
};
