import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type {
  TDisclosure,
  TGetDisclosuresDto,
} from "../types/disclosure.types";
import { getLocalDisclosures } from "@/libs/signaldb/disclosures.db";

export const disclosuresOfflineApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclosures: builder.infiniteQuery<
      TPaginatedResponse<TDisclosure>,
      TGetDisclosuresDto & { offline?: boolean },
      number
    >({
      queryFn: ({ queryArg, pageParam }) => ({
        data: getLocalDisclosures({ ...queryArg, pageNumber: pageParam! ?? 0 }),
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.totalCount === 0
            ? undefined
            : lastPage.pageNumber,
      },
      transformResponse: (res: ApiResponse<TPaginatedResponse<TDisclosure>>) =>
        res.data,
      // providesTags: ["Disclosures"],
    }),
  }),
});
