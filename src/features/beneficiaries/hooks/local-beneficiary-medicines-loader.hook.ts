import { localDb } from '@/libs/sqlocal';
import type { TBeneficiaryMedicine, TGetBeneficiaryMedicinesDto } from '../types/beneficiary.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';

export const useLocalBeneficiaryMedicinesLoader = (dto: TGetBeneficiaryMedicinesDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_BENEFICIARY_MEDICINES', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('patient_medicines').where('patientId', '=', dto.patientId);

      let medsIds: string[] = [];
      if (dto.name || dto.form) {
        let medsQuery = localDb.selectFrom('medicines').select('id');
        if (dto.name) {
          medsQuery = medsQuery.where('name', 'like', `%${dto.name}%`);
        }
        if (dto.form) {
          medsQuery = medsQuery.where('form', '=', dto.form);
        }
        medsIds = (await medsQuery.execute()).map((m) => m.id);
      }

      if (medsIds.length) {
        baseQuery = baseQuery.where('medicineId', 'in', medsIds);
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .select((col) => [
          jsonObjectFrom(
            col
              .selectFrom('medicines')
              .select(['medicines.id', 'medicines.name', 'medicines.form'])
              .whereRef('medicines.id', '=', 'patient_medicines.medicineId')
          ).as('medicine'),
        ])
        .limit(dto.pageSize || DEFAULT_PAGE_SIZE)
        .offset(dto.pageSize || DEFAULT_PAGE_SIZE * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as unknown as TBeneficiaryMedicine[];

      return {
        items,
        totalCount,
        pageSize: dto.pageSize || DEFAULT_PAGE_SIZE,
        pageNumber: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.items.length || lastPage.pageSize! > lastPage.items.length) {
        return undefined;
      }
      return Number(lastPage.pageNumber ?? 0) + 1;
    },
    initialPageParam: 0,
    enabled: isOffline,
  });
  return {
    items: data?.pages.map((p) => p.items).flat() ?? [],
    totalCount: data?.pages[0].totalCount ?? 0,
    ...restQueryResult,
  };
};
