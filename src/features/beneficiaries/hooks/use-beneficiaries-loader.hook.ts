import useReactivity from "@/core/hooks/use-reactivity.hook";
import type { TGetBeneficiariesDto } from "../types/beneficiary.types";
import beneficiaryApi from "../api/beneficiary.api";
import beneficiariesLocalDb from "@/libs/signaldb/beneficiaries.db";

export const useBeneficiariesLoader = (dto: TGetBeneficiariesDto = {}) => {
  const isOffline = true;

  const {
    data,
    error,
    isFetching: isLoading,
  } = beneficiaryApi.useGetBeneficiariesQuery(dto, {
    skip: isOffline,
  });

  const localResult = useReactivity(() => {
    const filters = {
      $and: [
        ...(dto.areaIds?.length
          ? [{ areaId: { $in: dto.areaIds ?? [] } }]
          : []),
        ...(dto.query?.length
          ? [
              {
                $or: [
                  {
                    name: { $regex: dto.query },
                  },
                  {
                    nationalNumber: { $regex: dto.query },
                  },
                  {
                    about: { $regex: dto.query },
                  },
                  {
                    address: { $regex: dto.query },
                  },
                  {
                    "phones.phone": { $regex: dto.query },
                  },
                ],
              },
            ]
          : []),
      ],
    };
    const totalCount = beneficiariesLocalDb
      .find(filters, {
        limit: dto.pageSize,
        skip: dto.pageSize,
      })
      .count();
    const items = beneficiariesLocalDb
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
