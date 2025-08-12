import { Collection } from "@signaldb/core";
// import createOPFSAdapter from "@signaldb/opfs";
import createIndexedDBAdapter from "@signaldb/indexeddb";
import maverickReactivityAdapter from "@signaldb/maverickjs";
import type { TDisclosure } from "@/features/disclosures/types/disclosure.types";

const disclosuresLocalDb = new Collection<TDisclosure>({
  reactivity: maverickReactivityAdapter,
  persistence: createIndexedDBAdapter("disclosures"),
});

export default disclosuresLocalDb;
