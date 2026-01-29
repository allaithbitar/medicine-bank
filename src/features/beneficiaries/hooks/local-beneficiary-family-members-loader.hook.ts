import { localDb } from '@/libs/sqlocal';
import type { TFamilyMember, TGetFamilyMembersDto } from '../types/beneficiary.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';

export const useLocalBeneficiaryFamilyMembersLoader = (dto: TGetFamilyMembersDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_BENEFICIARY_FAMILY_MEMBERS', dto],
    queryFn: async ({ pageParam }) => {
      const baseQuery = localDb.selectFrom('family_members').where('patientId', '=', dto.patientId);

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .limit(dto.pageSize || DEFAULT_PAGE_SIZE)
        .offset(dto.pageSize || DEFAULT_PAGE_SIZE * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as unknown as TFamilyMember[];

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
