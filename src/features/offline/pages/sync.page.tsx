import { Button, CircularProgress } from "@mui/material";
import offlineApi from "../api/offline.api";
import { useState } from "react";
import disclosuresLocalDb from "@/libs/signaldb/disclosures.db";
import disclosuresToRatingsLocalDb from "@/libs/signaldb/disclosures-to-ratings.db";
import beneficiariesLocalDb from "@/libs/signaldb/beneficiaries.db";

const SyncPage = () => {
  const [syncLocalData] = offlineApi.useLazySyncQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    const { data } = await syncLocalData({});
    disclosuresLocalDb.removeMany({});
    disclosuresLocalDb.insertMany(data.disclosures);

    disclosuresToRatingsLocalDb.removeMany({});
    disclosuresToRatingsLocalDb.insertMany(data.disclosuresRatings);

    beneficiariesLocalDb.removeMany({});
    beneficiariesLocalDb.insertMany(data.beneficiaries);

    console.log({ data });
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
    setIsLoading(false);
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
