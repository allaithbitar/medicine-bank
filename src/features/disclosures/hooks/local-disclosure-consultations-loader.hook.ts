import { localDb } from '@/libs/sqlocal';
import { useInfiniteQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type {
  TDisclosureAdviserConsultation,
  TGetDisclosureAdviserConsultationParams,
} from '../types/disclosure.types';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import { withCreatedBy, withUpdatedBy } from '@/libs/kysely/helpers';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';

export const useLocalDisclosureConsultationsLoader = (dto: TGetDisclosureAdviserConsultationParams) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_DISCLOSURE_CONSULTATIONS', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('disclosure_consultations');

      if (dto.disclosureId) {
        baseQuery = baseQuery.where('disclosureId', '=', dto.disclosureId);
      }

      if (dto.consultationStatus) {
        baseQuery = baseQuery.where('consultationStatus', '=', dto.consultationStatus);
      }

      if (dto.createdBy) {
        baseQuery = baseQuery.where('createdBy', '=', dto.createdBy);
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .select((eb) => [
          withCreatedBy(eb, 'createdBy'),
          withUpdatedBy(eb, 'updatedBy'),
          jsonObjectFrom(
            eb
              .selectFrom('employees')
              .select(['employees.id', 'employees.name'])
              .whereRef('employees.id', '=', 'disclosure_consultations.disclosureId')
          ).as('consultedBy'),
        ])
        .limit(dto.pageSize || DEFAULT_PAGE_SIZE)
        .offset(dto.pageSize || DEFAULT_PAGE_SIZE * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as unknown as TDisclosureAdviserConsultation[];

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
