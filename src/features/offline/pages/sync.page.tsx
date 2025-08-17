import { Button, CircularProgress } from "@mui/material";
import offlineApi from "../api/offline.api";
import { useState } from "react";
import { localDb } from "@/libs/sqlocal";
import { createTables } from "@/libs/kysely";

const SyncPage = () => {
  const [syncLocalData] = offlineApi.useLazySyncQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    await createTables();
    const { data } = await syncLocalData({});
    await createTables();

    // await localDb
    //   .insertInto("disclosures")
    //   .values({
    //     id: "01e18c37-58d9-4c21-a0dd-841b7161ed14",
    //     status: "finished",
    //     priorityId: "4375c833-a108-4de8-8afb-e4f15cc4e789",
    //     patientId: "7887d680-e1bc-4b5a-a354-ffa0efe064b5",
    //     employeeId: null,
    //     createdAt: "2025-08-14 08:57:13.733349+00",
    //     updatedAt: "2025-08-14 08:57:13.733349+00",
    //     employee: null,
    //     patient: JSON.stringify({
    //       id: "7887d680-e1bc-4b5a-a354-ffa0efe064b5",
    //       name: "Eileen Williamson",
    //       nationalNumber: "175515955611",
    //       areaId: "15c80db4-4da9-4aff-a48f-b5a6d469a921",
    //       address: "1836 Treutel Lock Suite 697",
    //       about: "geek, designer, musician 🪴",
    //       createdAt: "2025-08-14T08:19:16.109927+00:00",
    //       updatedAt: "2025-08-14T08:19:16.109927+00:00",
    //       phones: [
    //         {
    //           id: "c3373f88-b42e-485f-b3cc-14c13ab10233",
    //           patientId: "7887d680-e1bc-4b5a-a354-ffa0efe064b5",
    //           phone: "(440) 282-2",
    //         },
    //       ],
    //       area: {
    //         id: "15c80db4-4da9-4aff-a48f-b5a6d469a921",
    //         name: "القديمة",
    //         cityId: "54f9cce4-77a9-4fc1-a2c7-09898289c00b",
    //       },
    //     }),
    //     priority: JSON.stringify({
    //       id: "4375c833-a108-4de8-8afb-e4f15cc4e789",
    //       name: "عادي",
    //       color: "grey",
    //     }),
    //   })
    //   .execute();

    for (const disclosure of data.disclosures) {
      const { id, ...updateData } = disclosure;

      await localDb
        .insertInto("disclosures")
        .values(disclosure)
        .onConflict((oc) => oc.column("id").doUpdateSet(() => updateData))
        .execute();
    }

    for (const visit of data.visits) {
      const { id, ...updateData } = visit;

      await localDb
        .insertInto("visits")
        .values(visit)
        .onConflict((oc) => oc.column("id").doUpdateSet(() => updateData))
        .execute();
    }

    // await localDb.insertInto('disclosures').values()
    // disclosuresLocalDb.removeMany({});
    // disclosuresLocalDb.insertMany(data.disclosures);
    //
    // disclosuresToRatingsLocalDb.removeMany({});
    // disclosuresToRatingsLocalDb.insertMany(data.disclosuresRatings);
    //
    // beneficiariesLocalDb.removeMany({});
    // beneficiariesLocalDb.insertMany(data.beneficiaries);

    // const result = await localDb
    //   .insertInto("disclosures")
    //   .values(data.disclosures)
    //   .execute();
    // console.log({ result });

    // localDb.disclosures.bulkPut(data.disclosures);
    // await localDb.beneficiaries.bulkPut(data.beneficiaries);
    // await localDb.employees.bulkPut(data.employees);
    // await localDb.disclosures.bulkPut(data.disclosures);
    // await localDb.disclosuresRatings.bulkPut(data.disclosuresRatings);
    // await localDb.ratings.bulkPut(data.ratings);
    // await localDb.visits.bulkPut(data.visits);
    // await localDb.cities.bulkPut(data.cities);
    // await localDb.areas.bulkPut(data.areas);
    //
    // await Promise.all(
    //   data.beneficiaries.map((b) => localDb.beneficiaries.setItem(b.id, b)),
    //   data.employees.map((b) => localDb.employees.setItem(b.id, b)),
    //   data.disclosures.map((b) => localDb.disclosures.setItem(b.id, b)),
    //   data.disclosuresRatings.map((b) =>
    //     localDb.disclosuresRatings.setItem(b.id, b),
    //   ),
    //   data.ratings.map((b) => localDb.ratings.setItem(b.id, b)),
    //   data.visits.map((b) => localDb.visits.setItem(b.id, b)),
    //   data.cities.map((b) => localDb.cities.setItem(b.id, b)),
    //   data.areas.map((b) => localDb.areas.setItem(b.id, b)),
    // );
  };
  return (
    <Button
      onClick={handleSync}
      startIcon={isLoading ? <CircularProgress /> : null}
    >
      Sync
    </Button>
  );
};

export default SyncPage;
