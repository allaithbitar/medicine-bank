// const createdAtColumn = {
//   createdAt: text("created_at").notNull(),
// };
//
// const updatedAtColumn = {
//   updatedAt: text("updated_at").notNull(),
// };
//
// export const disclosures = sqliteTable("disclosures", {
//   id: text("id").primaryKey(),
//   status: text("status", { enum: disclosure_status_enum })
//     .notNull()
//     .default("active"),
//   priorityId: text("priority_id").notNull(),
//   // .references(() => priorityDegrees.id),
//   patientId: text("patient_id").notNull(),
//   // .references(() => patients.id),
//   employeeId: text("employee_id"),
//   ...createdAtColumn,
//   ...updatedAtColumn,
// });

import type { TBenefieciary } from "@/features/beneficiaries/types/beneficiary.types";
import type {
  TDisclosure,
  TDisclosureStatus,
  TDisclosureVisit,
} from "@/features/disclosures/types/disclosure.types";
import type { TPriorityDegree } from "@/features/priority-degres/types/priority-degree.types";
import type { JSONColumnType } from "kysely";

export type TLocalDb = {
  disclosures: {
    id: string;
    status: TDisclosureStatus;
    priorityId: string;
    patientId: string;
    employeeId: string | null;
    createdAt: string;
    updatedAt: string | null;
    patient: JSONColumnType<TBenefieciary>;
    priority: JSONColumnType<TPriorityDegree>;
    employee: JSONColumnType<TDisclosure["scout"]> | null;
    // patient: TBenefieciary;
    // priority: TPriorityDegree;
  };
  visits: TDisclosureVisit;
};
