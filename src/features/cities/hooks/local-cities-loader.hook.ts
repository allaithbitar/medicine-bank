import { localDb } from '@/libs/sqlocal';
import { useInfiniteQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TPaginationDto } from '@/core/types/common.types';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';

export const useLocalCitiesLoader = (dto: { name?: string | null } & TPaginationDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_CITIES', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('cities');

      if (dto.name) {
        baseQuery = baseQuery.where('name', 'like', `%${dto.name}%`);
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .limit(dto.pageSize || DEFAULT_PAGE_SIZE)
        .offset(dto.pageSize || DEFAULT_PAGE_SIZE * pageParam)
        .orderBy('name', 'asc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = await query.execute();

      return {
        items,
        totalCount,
        pageSize: dto.pageSize,
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
