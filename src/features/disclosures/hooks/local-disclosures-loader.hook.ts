import { localDb } from '@/libs/sqlocal';
import type { TDisclosure, TGetDisclosuresDto } from '../types/disclosure.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
export const useLocalDisclosuresLoader = ({ pageSize, ...dto }: TGetDisclosuresDto) => {
  const isOffline = useIsOffline();
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ['LOCAL_DISCLOSURES', dto],
    queryFn: async ({ pageParam }) => {
      let query = localDb
        .selectFrom('disclosures')
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
              .select(['priority_degrees.id', 'priority_degrees.name', 'priority_degrees.color'])
              .whereRef('priority_degrees.id', '=', 'disclosures.priorityId')
          ).as('priority'),
        ])
        .limit(pageSize!)
        .offset(pageSize! * pageParam)
        .orderBy('createdAt', 'desc');

      //
      // let collection = localDb.disclosures.toCollection();
      //
      if (dto.status?.length) {
        query = query.where('status', 'in', dto.status);
      }

      if (dto.type?.length) {
        query = query.where('type', 'in', dto.type);
      }

      if (dto.priorityIds?.length) {
        query = query.where('priorityId', 'in', dto.priorityIds);
      }

      if (dto.scoutIds?.length) {
        query = query.where('scoutId', 'in', dto.scoutIds);
      }

      if (dto.patientId) {
        query = query.where('patientId', '=', dto.patientId);
      }

      if (dto.createdAtStart) {
        query = query.where('createdAt', '>=', dto.createdAtStart);
      }

      if (dto.createdAtEnd) {
        query = query.where('createdAt', '<=', dto.createdAtEnd);
      }

      if (dto.undelivered) {
        query = query.where('scoutId', 'is', null);
      }

      if (dto.unvisited) {
        query = query.where('visitResult', 'is', null);
      }

      if (dto.appointmentDate) {
        query = query.where('appointmentDate', '=', dto.appointmentDate);
      }

      if (typeof dto.isAppointmentCompleted !== 'undefined') {
        query = query.where('isAppointmentCompleted', '=', dto.isAppointmentCompleted);
      }

      if (dto.archiveNumber) {
        query = query.where('archiveNumber', '=', dto.archiveNumber);
      }

      if (dto.isCustomRating) {
        query = query.where('isCustomRating', '=', dto.isCustomRating);
      }

      if (dto.ratingIds?.length) {
        query = query.where('ratingId', 'in', dto.ratingIds);
      }

      if (typeof dto.isReceived !== 'undefined') {
        query = query.where('isReceived', 'in', dto.isReceived);
      }

      if (dto.visitResult?.length) {
        const noramlizedVisitResult = dto.visitResult?.filter((v) => !!v);
        query = query.where('visitResult', 'in', noramlizedVisitResult);
      }

      const [{ count: totalCount }] = await localDb
        .selectFrom('disclosures')
        .select((eb) => eb.fn.count<number>('id').as('count'))
        .execute();

      const items = (await query.execute()) as TDisclosure[];

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
