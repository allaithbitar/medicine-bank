// import { localDb } from "@/libs/sqlocal";
//
// import type {
//   TDisclosureVisit,
//   TGetDisclosureVisitsDto,
// } from "../types/disclosure.types";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import useIsOffline from "@/core/hooks/use-is-offline.hook";
// export const useLocalVisitsLoader = ({
//   pageSize,
//   ...dto
// }: TGetDisclosureVisitsDto) => {
//   const isOffline = useIsOffline();
//   const { data, ...restQueryResult } = useInfiniteQuery({
//     queryKey: ["LOCAL_VISITS", dto],
//     queryFn: async ({ pageParam }) => {
//       let query = localDb
//         .selectFrom("visits")
//         .selectAll()
//         .where("disclosureId", "=", dto.disclosureId)
//         .limit(pageSize!)
//         .offset(pageSize! * pageParam);
//
//       if (dto.result) {
//         query = query.where("result", "=", dto.result);
//       }
//
//       const [{ count: totalCount }] = await localDb
//         .selectFrom("visits")
//         .select((eb) => eb.fn.count<number>("id").as("count"))
//         .where("disclosureId", "=", dto.disclosureId)
//         .execute();
//
//       const items = (await query.execute()) as TDisclosureVisit[];
//
//       return {
//         items,
//         totalCount,
//         pageSize: pageSize,
//         pageNumber: pageParam,
//       };
//     },
//     getNextPageParam: (lastPage) => {
//       if (
//         !lastPage.items.length ||
//         lastPage.pageSize! < lastPage.items.length
//       ) {
//         return undefined;
//       }
//       return Number(lastPage.pageNumber ?? 0) + 1;
//     },
//     initialPageParam: 0,
//     enabled: isOffline,
//   });
//   return {
//     items: data?.pages.map((p) => p.items).flat() ?? [],
//     totalCount: data?.pages[0].totalCount ?? 0,
//     ...restQueryResult,
//   };
// };
