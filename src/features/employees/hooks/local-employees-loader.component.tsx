import { localDb } from '@/libs/sqlocal';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TEmployee, TSearchEmployeesDto } from '../types/employee.types';
import { ParseJSONResultsPlugin } from 'kysely';
export const useLocalEmployeesLoader = ({ pageSize, ...dto }: TSearchEmployeesDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_EMPLOYEES', dto],
    queryFn: async ({ pageParam }) => {
      let query = localDb
        .selectFrom('employees')
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

        .limit(pageSize!)
        .offset(pageSize! * pageParam)
        .orderBy('createdAt', 'desc');

      if (dto.role?.length) {
        query = query.where('role', 'in', dto.role);
      }

      if (dto.pageNumber) {
        query = query.where('phone', 'like', `%${dto.pageNumber}%`);
      }

      if (dto.query) {
        query = query.where('name', 'like', `%${dto.query}%`);
      }

      if (dto.areaId) {
        const eids = await localDb
          .selectFrom('areas_to_employees')
          .select('employeeId')
          .where('areaId', '=', dto.areaId)
          .execute();
        query = query.where(
          'id',
          '=',
          eids.map((eid) => eid.employeeId)
        );
      }

      //
      // if (dto.type?.length) {
      //   query = query.where('type', 'in', dto.type);
      // }
      //
      // if (dto.priorityIds?.length) {
      //   query = query.where('priorityId', 'in', dto.priorityIds);
      // }
      //
      // if (dto.scoutIds?.length) {
      //   query = query.where('scoutId', 'in', dto.scoutIds);
      // }
      //
      // if (dto.patientId) {
      //   query = query.where('patientId', '=', dto.patientId);
      // }
      //
      // if (dto.createdAtStart) {
      //   query = query.where('createdAt', '>=', dto.createdAtStart);
      // }
      //
      // if (dto.createdAtEnd) {
      //   query = query.where('createdAt', '<=', dto.createdAtEnd);
      // }
      //
      // if (dto.undelivered) {
      //   query = query.where('scoutId', 'is', null);
      // }
      //
      // if (dto.unvisited) {
      //   query = query.where('visitResult', 'is', null);
      // }
      //
      // if (dto.appointmentDate) {
      //   query = query.where('appointmentDate', '=', dto.appointmentDate);
      // }
      //
      // if (typeof dto.isAppointmentCompleted !== 'undefined') {
      //   query = query.where('isAppointmentCompleted', '=', dto.isAppointmentCompleted);
      // }
      //
      // if (dto.archiveNumber) {
      //   query = query.where('archiveNumber', '=', dto.archiveNumber);
      // }
      //
      // if (dto.isCustomRating) {
      //   query = query.where('isCustomRating', '=', dto.isCustomRating);
      // }
      //
      // if (dto.ratingIds?.length) {
      //   query = query.where('ratingId', 'in', dto.ratingIds);
      // }
      //
      // if (typeof dto.isReceived !== 'undefined') {
      //   query = query.where('isReceived', 'in', dto.isReceived);
      // }
      //
      // if (dto.visitResult?.length) {
      //   const noramlizedVisitResult = dto.visitResult?.filter((v) => !!v);
      //   query = query.where('visitResult', 'in', noramlizedVisitResult);
      // }

      const [{ count: totalCount }] = await localDb
        .selectFrom('disclosures')
        .select((eb) => eb.fn.count<number>('id').as('count'))
        .execute();

      const items = (await query.execute()) as TEmployee[];

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
