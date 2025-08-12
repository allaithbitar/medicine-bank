import { Collection } from "@signaldb/core";
// import createOPFSAdapter from "@signaldb/opfs";
import createIndexedDBAdapter from "@signaldb/indexeddb";
import maverickReactivityAdapter from "@signaldb/maverickjs";
import type { TDisclosureRating } from "@/features/disclosures/types/disclosure.types";

const disclosuresToRatingsLocalDb = new Collection<TDisclosureRating>({
  reactivity: maverickReactivityAdapter,
  persistence: createIndexedDBAdapter("disclosures_to_ratings"),
});

export default disclosuresToRatingsLocalDb;
