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
      ...(dto.undelivered && {
        employeeId: { $eq: null },
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

  return {
    items: (isOffline ? localResult?.items : data?.items) ?? [],
    pageSize: dto.pageSize,
    pageNumber: dto.pageNumber,
    totalCount: (isOffline ? localResult?.totalCount : data?.totalCount) ?? 0,
    isLoading,
    error,
  };
};
