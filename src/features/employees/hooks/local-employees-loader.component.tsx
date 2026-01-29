import { localDb } from '@/libs/sqlocal';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TEmployee, TSearchEmployeesDto } from '../types/employee.types';
import { ParseJSONResultsPlugin } from 'kysely';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
export const useLocalEmployeesLoader = ({ pageSize, ...dto }: TSearchEmployeesDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_EMPLOYEES', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('employees');

      if (dto.role?.length) {
        baseQuery = baseQuery.where('role', 'in', dto.role);
      }

      if (dto.pageNumber) {
        baseQuery = baseQuery.where('phone', 'like', `%${dto.pageNumber}%`);
      }

      if (dto.query) {
        baseQuery = baseQuery.where('name', 'like', `%${dto.query}%`);
      }

      if (dto.areaId) {
        const eids = await localDb
          .selectFrom('areas_to_employees')
          .select('employeeId')
          .where('areaId', '=', dto.areaId)
          .execute();
        baseQuery = baseQuery.where(
          'id',
          '=',
          eids.map((eid) => eid.employeeId)
        );
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .select((ns) => [
          jsonArrayFrom(
            ns
              .selectFrom('areas_to_employees')
              .select([
                (nns) =>
                  jsonObjectFrom(
                    nns
                      .selectFrom('areas')
                      .select(['areas.id', 'areas.name', 'areas.cityId'])
                      .whereRef('areas_to_employees.areaId', '=', 'areas.id')
                  ).as('area'),
              ])
              .whereRef('areas_to_employees.employeeId', '=', 'employees.id')
          ).as('areas'),
        ])
        .withPlugin(new ParseJSONResultsPlugin())

        .limit(pageSize || DEFAULT_PAGE_SIZE)
        .offset(pageSize || DEFAULT_PAGE_SIZE * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;
      const countResult = await countQuery.execute();
      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as TEmployee[];

      return {
        items,
        totalCount,
        pageSize: pageSize,
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
