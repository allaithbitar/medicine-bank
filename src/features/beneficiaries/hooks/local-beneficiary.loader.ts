import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import type { TBenefieciary } from '../types/beneficiary.types';
import STRINGS from '@/core/constants/strings.constant';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { ParseJSONResultsPlugin } from 'kysely';

export const useLocalBeneficiaryLoader = ({ id }: { id: string }) => {
  const isOffline = true;
  const queryResult = useQuery({
    queryKey: ['LOCAL_BENEFICIARY', id],
    queryFn: async () => {
      const res = (await localDb
        .selectFrom('patients')
        .selectAll()
        .select((col) => [
          jsonArrayFrom(
            col
              .selectFrom('patients_phone_numbers')
              .select(['patients_phone_numbers.id', 'patients_phone_numbers.patientId', 'patients_phone_numbers.phone'])
              .whereRef('patients_phone_numbers.patientId', '=', 'patients.id')
          ).as('phones'),
          jsonObjectFrom(
            col
              .selectFrom('areas')
              .select(['areas.id', 'areas.name'])
              .whereRef('areas.id', '=', 'patients.areaId')
          ).as('area'),
        ])

        .where('id', '=', id)
        .withPlugin(new ParseJSONResultsPlugin())
        .executeTakeFirstOrThrow(() => new Error(STRINGS.local_not_found_error))) as unknown as TBenefieciary;

      return res;
    },
    enabled: isOffline && !!id,
  });
  return queryResult;
};