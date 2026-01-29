import { localDb } from '@/libs/sqlocal';
import { useInfiniteQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TDisclosureNote, TGetDisclosureNotesDto } from '../types/disclosure.types';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import { withCreatedBy } from '@/libs/kysely/helpers';

export const useLocalDisclosureNotesLoader = (dto: TGetDisclosureNotesDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_DISCLOSURE_NOTES', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('disclosure_notes').where('disclosureId', '=', dto.disclosureId);

      if (dto.query) {
        baseQuery = baseQuery.where('noteText', 'like', `%${dto.query}%`);
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .select((eb) => [withCreatedBy(eb, 'createdBy')])
        .limit(dto.pageSize || DEFAULT_PAGE_SIZE)
        .offset(dto.pageSize || DEFAULT_PAGE_SIZE * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as TDisclosureNote[];

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
