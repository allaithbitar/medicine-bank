import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import type { TAutocompleteDto } from '@/features/autocomplete/api/autocomplete.api';
import type { TMedicine } from '../../types/medicines.types';

export const useLocalMedicinesAutocompleteLoader = (dto: TAutocompleteDto<TMedicine>) => {
  const isOffline = useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_MEDICINES_AUTOCOMPLETE', dto],
    queryFn: async () => {
      let baseQuery = localDb.selectFrom('medicines');

      if (dto.query) {
        baseQuery = baseQuery.where('name', 'like', `%${dto.query}%`);
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .select(['id', 'name', 'doseVariants'])
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
