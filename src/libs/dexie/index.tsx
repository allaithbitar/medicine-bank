import Dexie, { type EntityTable } from "dexie";

type TPatient = {
  name: string;
  uuid: string;
  dbId?: number;
};

export const db = new Dexie("patients") as Dexie & {
  patients: EntityTable<TPatient, "dbId">;
};

db.version(1).stores({
  patients: "++dbId, uuid",
});
