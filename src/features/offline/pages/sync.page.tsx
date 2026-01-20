import { jsonObjectFrom, jsonArrayFrom } from 'kysely/helpers/sqlite';
import { Button, CircularProgress } from '@mui/material';
// import offlineApi from "../api/offline.api";
import { useState } from 'react';
// import { localDb } from "@/libs/sqlocal";
import { createTables } from '@/libs/kysely';
import offlineApi from '../api/offline.api';
import { localDb } from '@/libs/sqlocal';
import { ParseJSONResultsPlugin } from 'kysely';

const SyncPage = () => {
  const [syncLocalData] = offlineApi.useLazySyncQuery();
  const [isLoading] = useState(false);

  const handleSync = async () => {
    const { data } = await syncLocalData({});
    console.log(data);

    // await createTables();
    await localDb.deleteFrom('employees').execute();
    await localDb.insertInto('employees').values(data.employees).execute();
    await localDb.deleteFrom('areas_to_employees').execute();
    await localDb.insertInto('areas_to_employees').values(data.areasToEmployees).execute();
    await localDb.deleteFrom('patients').execute();
    await localDb.insertInto('patients').values(data.patients).execute();
    await localDb.deleteFrom('patients_phone_numbers').execute();
    await localDb.insertInto('patients_phone_numbers').values(data.patientsPhoneNumbers).execute();

    await localDb.deleteFrom('disclosures').execute();
    await localDb.insertInto('disclosures').values(data.disclosures).execute();
    // await localDb.deleteFrom('disclosure_notes').execute();
    // await localDb.insertInto('disclosure_notes').values(data.disclosureNotes).execute();
    // await localDb.deleteFrom('disclosure_details').execute();
    // await localDb.insertInto('disclosure_details').values(data.disclosureDetails).execute();
    await localDb.deleteFrom('audit_logs').execute();
    await localDb.insertInto('audit_logs').values(data.auditLogs).execute();
    await localDb.deleteFrom('cities').execute();
    await localDb.insertInto('cities').values(data.cities).execute();
    await localDb.deleteFrom('areas').execute();
    await localDb.insertInto('areas').values(data.areas).execute();
    await localDb.deleteFrom('priority_degrees').execute();
    await localDb.insertInto('priority_degrees').values(data.priorityDegrees).execute();
    await localDb.deleteFrom('ratings').execute();
    await localDb.insertInto('ratings').values(data.ratings).execute();

    // disclosures //
    // console.log(
    //   await localDb
    //     .selectFrom('disclosures')
    //     .selectAll()
    //     .select((eb) => [
    //       jsonObjectFrom(
    //         eb
    //           .selectFrom('ratings')
    //           .select(['ratings.id', 'ratings.name', 'ratings.code', 'ratings.description'])
    //           .whereRef('ratings.id', '=', 'disclosures.ratingId')
    //       ).as('rating'),
    //     ])
    //     .execute()
    // );

    // employees //
    // console.log(
    //   await localDb
    //     .selectFrom('employees')
    //     .selectAll()
    //     .select((ns) => [
    //       jsonArrayFrom(
    //         ns
    //           .selectFrom('areas_to_employees')
    //           .select([
    //             (nns) =>
    //               jsonObjectFrom(
    //                 nns
    //                   .selectFrom('areas')
    //                   .select(['areas.id', 'areas.name', 'areas.cityId'])
    //                   .whereRef('areas_to_employees.areaId', '=', 'areas.id')
    //               ).as('area'),
    //           ])
    //           .whereRef('areas_to_employees.employeeId', '=', 'employees.id')
    //       ).as('areas'),
    //     ])
    //     .withPlugin(new ParseJSONResultsPlugin())
    //     .execute()
    // );

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

    // for (const disclosure of data.disclosures) {
    //   const { id, ...updateData } = disclosure;
    //
    //   await localDb
    //     .insertInto('disclosures')
    //     .values(disclosure)
    //     .onConflict((oc) => oc.column('id').doUpdateSet(() => updateData))
    //     .execute();
    // }

    // for (const visit of data.visits) {
    //   const { id, ...updateData } = visit;
    //
    //   await localDb
    //     .insertInto('visits')
    //     .values(visit)
    //     .onConflict((oc) => oc.column('id').doUpdateSet(() => updateData))
    //     .execute();
    // }

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
    <Button onClick={handleSync} startIcon={isLoading ? <CircularProgress /> : null}>
      Sync
    </Button>
  );
};

export default SyncPage;
