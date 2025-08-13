import { Collection } from "@signaldb/core";
// import createOPFSAdapter from "@signaldb/opfs";
import createIndexedDBAdapter from "@signaldb/indexeddb";
import maverickReactivityAdapter from "@signaldb/maverickjs";
import type { TBenefieciary } from "@/features/beneficiaries/types/beneficiary.types";

const beneficiariesLocalDb = new Collection<TBenefieciary>({
  reactivity: maverickReactivityAdapter,
  persistence: createIndexedDBAdapter("beneficiaries"),
});

export default beneficiariesLocalDb;
