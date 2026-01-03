// import { Collection } from "@signaldb/core";
// // import createOPFSAdapter from "@signaldb/opfs";
// import createIndexedDBAdapter from "@signaldb/indexeddb";
// import maverickReactivityAdapter from "@signaldb/maverickjs";
// import type {
//   TDisclosure,
//   TGetDisclosuresDto,
// } from "@/features/disclosures/types/disclosure.types";
// import disclosuresToRatingsLocalDb from "./disclosures-to-ratings.db";
//
// const disclosuresLocalDb = new Collection<TDisclosure>({
//   reactivity: maverickReactivityAdapter,
//   persistence: createIndexedDBAdapter("disclosures"),
// });
//
// export const getLocalDisclosures = (dto: TGetDisclosuresDto) => {
//   console.log(dto, "123", "hi");
//
//   let disclosureIds: string[] = [];
//   if (dto.ratingIds) {
//     disclosureIds = disclosuresToRatingsLocalDb
//       .find({ ratingId: { $in: dto.ratingIds } })
//       .fetch()
//       .map((disclosureRating) => disclosureRating.disclosureId);
//   }
//
//   const filters = {
//     ...(dto.status?.length && {
//       status: { $in: dto.status },
//     }),
//     ...(dto.priorityIds?.length && {
//       priorityId: { $in: dto.priorityIds },
//     }),
//     ...(dto.scoutIds?.length && {
//       employeeId: { $in: dto.priorityIds },
//     }),
//     ...(dto.patientId && {
//       patientId: { $eq: dto.patientId },
//     }),
//     ...(dto.patientId && {
//       patientId: { $eq: dto.patientId },
//     }),
//     ...(dto.createdAtStart && {
//       createdAt: { $gte: dto.createdAtStart },
//     }),
//     ...(dto.createdAtEnd && {
//       createdAt: { $lte: dto.createdAtEnd },
//     }),
//     ...(disclosureIds.length && {
//       id: { $in: disclosureIds },
//     }),
//     ...(dto.undelivered && {
//       employeeId: { $eq: null },
//     }),
//   };
//   const totalCount = disclosuresLocalDb.find(filters).count();
//   const items = disclosuresLocalDb
//     .find(filters, {
//       limit: dto.pageSize,
//       skip: dto.pageNumber! * dto.pageSize!,
//     })
//     .fetch();
//
//   return {
//     items,
//     totalCount,
//     pageSize: dto.pageSize,
//     pageNumber: dto.pageNumber,
//   };
// };
//
// export default disclosuresLocalDb;
