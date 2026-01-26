import { localDb } from '@/libs/sqlocal';
import type { TDisclosure, TGetDisclosuresDto } from '../types/disclosure.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import { sql } from 'kysely';
export const useLocalDisclosuresLoader = ({ pageSize, ...dto }: TGetDisclosuresDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_DISCLOSURES', dto],
    queryFn: async ({ pageParam }) => {
      let baseQuery = localDb.selectFrom('disclosures');

      //
      // let collection = localDb.disclosures.toCollection();
      //
      if (dto.status?.length) {
        baseQuery = baseQuery.where('status', 'in', dto.status);
      }

      if (dto.type?.length) {
        baseQuery = baseQuery.where('type', 'in', dto.type);
      }

      if (dto.priorityIds?.length) {
        baseQuery = baseQuery.where('priorityId', 'in', dto.priorityIds);
      }

      if (dto.scoutIds?.length) {
        baseQuery = baseQuery.where('scoutId', 'in', dto.scoutIds);
      }

      if (dto.patientId) {
        baseQuery = baseQuery.where('patientId', '=', dto.patientId);
      }

      if (dto.createdAtStart) {
        baseQuery = baseQuery.where('createdAt', '>=', dto.createdAtStart);
      }

      if (dto.createdAtEnd) {
        baseQuery = baseQuery.where('createdAt', '<=', dto.createdAtEnd);
      }

      if (dto.undelivered) {
        baseQuery = baseQuery.where('scoutId', 'is', null);
      }

      if (dto.unvisited) {
        baseQuery = baseQuery.where('visitResult', 'is', null);
      }

      if (dto.appointmentDate) {
        baseQuery = baseQuery.where('appointmentDate', '=', dto.appointmentDate);
      }

      if (typeof dto.isAppointmentCompleted !== 'undefined') {
        baseQuery = baseQuery.where('isAppointmentCompleted', '=', dto.isAppointmentCompleted);
      }

      if (dto.archiveNumber) {
        baseQuery = baseQuery.where('archiveNumber', '=', dto.archiveNumber);
      }

      if (dto.isCustomRating) {
        baseQuery = baseQuery.where('isCustomRating', '=', dto.isCustomRating);
      }

      if (dto.ratingIds?.length) {
        baseQuery = baseQuery.where('ratingId', 'in', dto.ratingIds);
      }

      if (typeof dto.isReceived !== 'undefined') {
        baseQuery = baseQuery.where('isReceived', '=', dto.isReceived);
      }

      if (dto.visitResult?.length) {
        const noramlizedVisitResult = dto.visitResult?.filter((v) => !!v);
        baseQuery = baseQuery.where('visitResult', 'in', noramlizedVisitResult);
      }

      if (dto.areaIds?.length) {
        const patientIds = await localDb
          .selectFrom('patients')
          .select('id')
          .where('areaId', 'in', dto.areaIds)
          .execute();

        baseQuery = baseQuery.where(
          'patientId',
          'in',
          patientIds.map((p) => p.id)
        );
      }

      if (dto.isLate) {
        const priorityDegrees = await localDb
          .selectFrom('priority_degrees')
          .select(['id', 'durationInDays'])
          .where('durationInDays', 'is not', null)
          .execute();

        if (priorityDegrees.length > 0) {
          baseQuery = baseQuery.where((eb) =>
            eb.or(
              priorityDegrees.map((pd) =>
                eb.and([
                  eb(sql.raw('createdAt'), '<=', sql.raw(`datetime('now', '-${pd.durationInDays} days')`)),
                  eb('priorityId', '=', pd.id),
                  eb('status', '=', 'active'),
                  eb('visitResult', 'is', null),
                  eb.and([eb('ratingId', 'is', null), eb('customRating', 'is', null)]),
                ])
              )
            )
          );
        }
      }

      const countQuery = baseQuery.select((eb) => eb.fn.count<number>('id').as('count'));

      const query = baseQuery
        .selectAll()
        .select((col) => [
          jsonObjectFrom(
            col
              .selectFrom('ratings')
              .select(['ratings.id', 'ratings.name', 'ratings.code', 'ratings.description'])
              .whereRef('ratings.id', '=', 'disclosures.ratingId')
          ).as('rating'),
          jsonObjectFrom(
            col
              .selectFrom('employees')
              .select(['employees.id', 'employees.name'])
              .whereRef('employees.id', '=', 'disclosures.scoutId')
          ).as('scout'),
          jsonObjectFrom(
            col
              .selectFrom('patients')
              .select(['patients.id', 'patients.name'])
              .whereRef('patients.id', '=', 'disclosures.patientId')
          ).as('patient'),
          jsonObjectFrom(
            col
              .selectFrom('priority_degrees')
              .select([
                'priority_degrees.id',
                'priority_degrees.name',
                'priority_degrees.color',
                'priority_degrees.durationInDays',
              ])
              .whereRef('priority_degrees.id', '=', 'disclosures.priorityId')
          ).as('priority'),
        ])
        .limit(pageSize || DEFAULT_PAGE_SIZE)
        .offset(pageSize || DEFAULT_PAGE_SIZE! * pageParam)
        .orderBy('createdAt', 'desc');

      let totalCount = 0;

      const countResult = await countQuery.execute();

      totalCount = countResult[0]?.count ?? 0;

      const items = (await query.execute()) as unknown as TDisclosure[];

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
