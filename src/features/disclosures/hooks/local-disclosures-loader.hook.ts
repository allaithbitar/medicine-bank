import { localDb } from "@/libs/sqlocal";
import type {
  TDisclosure,
  TGetDisclosuresDto,
} from "../types/disclosure.types";
import { useInfiniteQuery } from "@tanstack/react-query";
export const useLocalDisclosuresLoader = ({
  pageSize,
  ...dto
}: TGetDisclosuresDto) => {
  const { data, ...restQueryResult } = useInfiniteQuery({
    queryKey: ["LOCAL_DISCLOSURES", dto],
    queryFn: async ({ pageParam }) => {
      let query = localDb
        .selectFrom("disclosures")
        .selectAll()
        .limit(pageSize!)
        .offset(pageSize! * pageParam);

      console.log({ dto });

      //
      // let collection = localDb.disclosures.toCollection();
      //
      if (dto.status?.length) {
        query = query.where("status", "in", dto.status);
      }

      if (dto.priorityIds?.length) {
        query = query.where("priorityId", "in", dto.priorityIds);
      }

      if (dto.scoutIds?.length) {
        query = query.where("employeeId", "in", dto.scoutIds);
      }

      if (dto.patientId) {
        query = query.where("patientId", "=", dto.patientId);
      }

      if (dto.createdAtStart) {
        query = query.where("createdAt", ">=", dto.createdAtStart);
      }

      if (dto.createdAtEnd) {
        query = query.where("createdAt", "<=", dto.createdAtEnd);
      }

      if (dto.undelivered) {
        query = query.where("employeeId", "=", null);
      }

      // let disclosureIds: string[] = [];
      // if (dto.ratingIds) {
      //   disclosureIds = disclosuresToRatingsLocalDb
      //     .find({ ratingId: { $in: dto.ratingIds } })
      //     .fetch()
      //     .map((disclosureRating) => disclosureRating.disclosureId);
      // }
      // //

      const [{ count: totalCount }] = await localDb
        .selectFrom("disclosures")
        .select((eb) => eb.fn.count<number>("id").as("count"))
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
      if (
        !lastPage.items.length ||
        lastPage.pageSize! < lastPage.items.length
      ) {
        return undefined;
      }
      return Number(lastPage.pageNumber ?? 0) + 1;
    },
    initialPageParam: 0,
  });
  return {
    items: data?.pages.map((p) => p.items).flat() ?? [],
    totalCount: data?.pages[0].totalCount ?? 0,
    ...restQueryResult,
  };
};
