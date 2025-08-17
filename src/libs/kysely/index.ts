import { localDb } from "../sqlocal";

// id: string;
//  status: TDisclosureStatus;
//  priorityId: string;
//  patientId: string;
//  employeeId: string | null;
//  createdAt: string;
//  updatedAt: string | null;
//  patient: TBenefieciary;
//  priority: TPriorityDegree;
export async function createTables() {
  await localDb.schema
    .createTable("disclosures")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("priorityId", "uuid", (col) => col.notNull())
    .addColumn("patientId", "uuid", (col) => col.notNull())
    .addColumn("employeeId", "uuid")
    .addColumn("createdAt", "datetime", (col) => col.notNull())
    .addColumn("updatedAt", "datetime")
    .addColumn("patient", "json", (col) => col.notNull())
    .addColumn("employee", "json")
    .addColumn("priority", "json")
    .execute();

  await localDb.schema
    .createTable("visits")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("disclosureId", "uuid", (col) => col.notNull())
    .addColumn("result", "text", (col) => col.notNull())
    .addColumn("reason", "text")
    .addColumn("note", "text")
    .addColumn("createdAt", "text", (col) => col.notNull())
    .addColumn("updatedAt", "text")
    .addColumn("createdBy", "text")
    .addColumn("updatedBy", "text")
    .execute();
}
