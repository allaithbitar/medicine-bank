import disclosuresToRatingsLocalDb from "@/libs/signaldb/disclosures-to-ratings.db";
import disclosuresApi from "../api/disclosures.api";
import type { TGetDisclosuresDto } from "../types/disclosure.types";
import useReactivity from "@/core/hooks/use-reactivity.hook";
import disclosuresLocalDb from "@/libs/signaldb/disclosures.db";
// import { localDb } from "@/libs/dexie";

export const useDisclosuresLoader = (dto: TGetDisclosuresDto = {}) => {
  const isOffline = true;

  const {
    data,
    error,
    isFetching: isLoading,
  } = disclosuresApi.useGetDisclosuresQuery(dto, {
    skip: isOffline,
  });

  const localResult = useReactivity(() => {
    let disclosureIds: string[] = [];
    if (dto.ratingIds) {
      disclosureIds = disclosuresToRatingsLocalDb
        .find({ ratingId: { $in: dto.ratingIds } })
        .fetch()
        .map((disclosureRating) => disclosureRating.disclosureId);
    }

    const filters = {
      ...(dto.status?.length && {
        status: { $in: dto.status },
      }),
      ...(dto.priorityIds?.length && {
        priorityId: { $in: dto.priorityIds },
      }),
      ...(dto.employeeIds?.length && {
        employeeId: { $in: dto.priorityIds },
      }),
      ...(dto.patientId && {
        patientId: { $eq: dto.patientId },
      }),
      ...(dto.patientId && {
        patientId: { $eq: dto.patientId },
      }),
      ...(dto.createdAtStart && {
        createdAt: { $gte: dto.createdAtStart },
      }),
      ...(dto.createdAtEnd && {
        createdAt: { $lte: dto.createdAtEnd },
      }),
      ...(disclosureIds.length && {
        id: { $in: disclosureIds },
      }),
    };
    const totalCount = disclosuresLocalDb
      .find(filters, {
        limit: dto.pageSize,
        skip: dto.pageSize,
      })
      .count();
    const items = disclosuresLocalDb
      .find(filters, {
        limit: dto.pageSize,
        skip: dto.pageNumber! * dto.pageSize!,
      })
      .fetch();

    return { items, totalCount };
  }, [dto]);

  // const localResult = useLiveQuery(async () => {
  //   let query = localDb.disclosures;
  //
  //   if (dto.pageSize) {
  //     query = query.limit(dto.pageSize);
  //   }
  //
  //   if (dto.pageNumber) {
  //     query = query.offset(dto.pageNumber);
  //   }
  //
  //   query = query.filter((d) => {
  //     const conditions = [];
  //     console.log(d);
  //
  //     if (dto.priorityIds?.length) {
  //     }
  //
  //     if (dto.employeeIds?.length && d.employeeId) {
  //       conditions.push(dto.employeeIds.includes(d.employeeId));
  //     }
  //
  //     if (dto.status?.length) {
  //       conditions.push(dto.status.includes(d.status));
  //     }
  //
  //     if (dto.patientId) {
  //       conditions.push(dto.patientId.includes(d.patientId));
  //     }
  //
  //     return conditions.every(Boolean);
  //   });
  //
  //   // if (dto.employeeIds) {
  //   //   query = query.where("employeeId").anyOf(dto.employeeIds)
  //   // }
  //
  //   // if (dto.status) {
  //   //   query = query.where("status").anyOf(dto.status);
  //   // }
  //
  //   // if (dto.patientId) {
  //   //   query = query.and.where("patientId").anyOf(dto.patientId);
  //   // }
  //
  //   return { items: await query.toArray(), totalCount: await query.count() };
  // }, [dto]);

  return {
    items: (isOffline ? localResult?.items : data?.items) ?? [],
    pageSize: dto.pageSize,
    pageNumber: dto.pageNumber,
    totalCount: (isOffline ? localResult?.totalCount : data?.totalCount) ?? 0,
    isLoading,
    error,
  };
};
