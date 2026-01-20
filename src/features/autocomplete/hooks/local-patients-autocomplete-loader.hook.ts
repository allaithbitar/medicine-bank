import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TAutocompleteDto } from '../api/autocomplete.api';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';

export const useLocalPatientsAutocompleteLoader = (dto: TAutocompleteDto) => {
  const isOffline = useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_PATIENTS_AUTOCOMPLETE', dto],
    queryFn: async () => {
      let baseQuery = localDb
        .selectFrom('patients')
        .select(['id', 'name', 'nationalNumber'])
        .select((col) => [
          jsonObjectFrom(
            col
              .selectFrom('patients_phone_numbers')
              .select(['patients_phone_numbers.phone'])
              .whereRef('patients_phone_numbers.patientId', '=', 'patients.id')
              .limit(1)
          ).as('phone'),
        ]);

      if (dto.query) {
        baseQuery = baseQuery.where((eb) =>
          eb.or([
            eb('name', 'like', `%${dto.query}%`),
            eb('nationalNumber', 'like', `%${dto.query}%`),
          ])
        );
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .limit(dto.pageSize || DEFAULT_PAGE_SIZE)
        .offset((dto.pageSize || DEFAULT_PAGE_SIZE) * (dto.pageNumber || DEFAULT_PAGE_NUMBER))
        .orderBy('name', 'asc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = await query.execute();

      return {
        items,
        totalCount,
        pageSize: dto.pageSize || DEFAULT_PAGE_SIZE,
        pageNumber: dto.pageNumber || DEFAULT_PAGE_NUMBER,
      };
    },
    enabled: isOffline,
  });
  return queryResult;
};