import { localDb } from '@/libs/sqlocal';
import type { TBenefieciary, TGetBeneficiariesDto } from '../types/beneficiary.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const useLocalBeneficiariesLoader = ({ pageSize, ...dto }: TGetBeneficiariesDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_BENEFICIARIES', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('patients');

      if (dto.name) {
        baseQuery = baseQuery.where('name', 'like', `%${dto.name}%`);
      }

      if (dto.nationalNumber) {
        baseQuery = baseQuery.where('nationalNumber', '=', dto.nationalNumber);
      }

      if (dto.phone) {
        // Need to join with phones
        baseQuery = baseQuery.where((eb) =>
          eb.exists(
            eb
              .selectFrom('patients_phone_numbers')
              .whereRef('patients_phone_numbers.patientId', '=', 'patients.id')
              .where('patients_phone_numbers.phone', 'like', `%${dto.phone}%`)
          )
        );
      }

      if (dto.areaIds?.length) {
        baseQuery = baseQuery.where('areaId', 'in', dto.areaIds);
      }

      if (dto.birthDate) {
        baseQuery = baseQuery.where('birthDate', '=', dto.birthDate);
      }

      if (dto.job) {
        baseQuery = baseQuery.where('job', 'like', `%${dto.job}%`);
      }

      if (dto.gender !== undefined) {
        baseQuery = baseQuery.where('gender', '=', dto.gender as 'male' | 'female' | null);
      }

      if (dto.address) {
        baseQuery = baseQuery.where('address', 'like', `%${dto.address}%`);
      }

      if (dto.about) {
        baseQuery = baseQuery.where('about', 'like', `%${dto.about}%`);
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .select((col) => [
          jsonArrayFrom(
            col
              .selectFrom('patients_phone_numbers')
              .select(['patients_phone_numbers.id', 'patients_phone_numbers.patientId', 'patients_phone_numbers.phone'])
              .whereRef('patients_phone_numbers.patientId', '=', 'patients.id')
          ).as('phones'),
          jsonObjectFrom(
            col.selectFrom('areas').select(['areas.id', 'areas.name']).whereRef('areas.id', '=', 'patients.areaId')
          ).as('area'),
        ])
        .limit(pageSize!)
        .offset(pageSize! * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as TBenefieciary[];

      return {
        items,
        totalCount,
        pageSize: pageSize,
        pageNumber: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.items.length || lastPage.pageSize! < lastPage.items.length) {
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

