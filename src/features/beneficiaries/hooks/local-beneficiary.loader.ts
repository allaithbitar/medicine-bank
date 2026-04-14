import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import type { TBenefieciary } from '../types/beneficiary.types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { ParseJSONResultsPlugin } from 'kysely';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const getLocalBeneficiary = async (id: string): Promise<TBenefieciary | null> => {
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
          .select((nCol) => [
            'areas.id',
            'areas.name',
            'areas.cityId',
            jsonObjectFrom(
              nCol.selectFrom('cities').select(['name', 'id']).whereRef('areas.cityId', '=', 'cities.id')
            ).as('city'),
          ])
          .whereRef('areas.id', '=', 'patients.areaId')
      ).as('area'),
    ])

    .where('id', '=', id)
    .withPlugin(new ParseJSONResultsPlugin())
    .executeTakeFirst()) as unknown as TBenefieciary;

  return res || null;
};

export const useLocalBeneficiaryLoader = ({ id }: { id: string }, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_BENEFICIARY', id, forceOffline],
    queryFn: async () => getLocalBeneficiary(id),
    enabled: isOffline && !!id,
  });
  return queryResult;
};
