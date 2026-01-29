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

import type { TFormValue } from '@/features/banks/types/medicines.types';
import type { TGender, TKinship } from '@/features/beneficiaries/types/beneficiary.types';
import type {
  TDisclosureStatus,
  TDisclosureType,
  TDisclosureVisitResult,
} from '@/features/disclosures/types/disclosure.types';
import type { TEmployeeRole } from '@/features/employees/types/employee.types';
import type { TBroadcastAudience, TBroadcastType } from '@/features/system-broadcasts/types/system-broadcasts.types';

// export type TEmployeeRole = 'manager' | 'supervisor' | 'scout';
// export type TGender = 'male' | 'female';
// export type TKinshep = 'partner' | 'child' | 'parent' | 'brother' | 'grandparent' | 'grandchild';
export type THouseHoldAssetCondition = 'very_good' | 'good' | 'medium' | 'bad' | 'very_bad' | 'not_working';
export type THouseOwnership = 'owned' | 'rent' | 'loan' | 'mortage';
// export type TMedicineForm = 'pill' | 'syrup' | 'injection' | 'capsule' | 'ointment';
export type TNotificationType = 'consultation_requested' | 'consultation_completed' | 'disclosure_assigned';
// export type TSystemBroadcastType = 'meeting' | 'custom';
// export type TBroadcastAudience = 'all' | 'scouts' | 'supervisors';
export type TAuditTable = 'disclosures' | 'disclosure_notes' | 'disclosure_consultations' | 'disclosure_details';
// export type TAuditAction = 'INSERT' | 'UPDATE' | 'DELETE';
// export type TConsultationStatus = 'pending' | 'completed';

export type TLocalDb = {
  cities: {
    id: string;
    name: string;
  };
  areas: {
    id: string;
    name: string;
    cityId: string;
  };
  employees: {
    id: string;
    name: string;
    password: string;
    phone: string;
    role: TEmployeeRole;
    createdAt: string;
    updatedAt: string | null;
  };
  areas_to_employees: {
    id: string;
    employeeId: string;
    areaId: string;
  };
  patients: {
    id: string;
    name: string;
    nationalNumber: string | null;
    birthDate: string | null;
    gender: TGender | null;
    job: string | null;
    address: string | null;
    about: string | null;
    areaId: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
  family_members: {
    id: string;
    name: string;
    birthDate: string | null;
    gender: TGender | null;
    nationalNumber: string | null;
    kinshep: TKinship | null;
    jobOrSchool: string | null;
    note: string | null;
    kidsCount: number | null;
    patientId: string;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
  medicines: {
    id: string;
    name: string;
    form: TFormValue;
    doseVariants: number[];
  };
  patient_medicines: {
    id: string;
    patientId: string;
    medicineId: string;
    dosePerIntake: number | null;
    intakeFrequency: string | null;
    note: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
  patients_phone_numbers: {
    id: string;
    patientId: string;
    phone: string;
  };
  priority_degrees: {
    id: string;
    name: string;
    color: string | null;
    durationInDays: number | null;
  };
  ratings: {
    id: string;
    name: string;
    description: string | null;
    code: string;
  };
  disclosures: {
    id: string;
    status: TDisclosureStatus;
    type: TDisclosureType;
    priorityId: string;
    patientId: string;
    scoutId: string | null;
    initialNote: string | null;
    isReceived: boolean;
    archiveNumber: number | null;
    visitResult: TDisclosureVisitResult | null;
    visitReason: string | null;
    visitNote: string | null;
    ratingId: string | null;
    isCustomRating: boolean;
    customRating: string | null;
    ratingNote: string | null;
    appointmentDate: string | null;
    isAppointmentCompleted: boolean;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
  disclosure_notes: {
    id: string;
    noteAudio: string | null;
    noteText: string | null;
    disclosureId: string;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string | null;
  };
  disclosure_details: {
    disclosureId: string;
    diseasesOrSurgeries: string | null;
    jobOrSchool: string | null;
    electricity: string | null;
    expenses: string | null;
    houseOwnership: THouseOwnership | null;
    houseOwnershipNote: string | null;
    houseCondition: THouseHoldAssetCondition | null;
    houseConditionNote: string | null;
    pros: string | null;
    cons: string | null;
    other: string | null;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
  };
  notifications: {
    id: string;
    type: TNotificationType;
    from: string;
    to: string;
    text: string | null;
    recordId: string | null;
    readAt: string | null;
  };
  system_broadcasts: {
    id: string;
    type: TBroadcastType;
    title: string | null;
    details: string | null;
    audience: TBroadcastAudience;
    createdAt: string;
  };
  meetings: {
    id: string;
    note: string | null;
    date: string | null;
    createdAt: string;
  };
  disclosure_consultations: {
    id: string;
    disclosureId: string;
    consultationStatus: 'pending' | 'completed';
    consultedBy: string | null;
    consultationNote: string | null;
    consultationAudio: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
  audit_logs: {
    id: string;
    table: TAuditTable;
    column: string | null;
    action: 'INSERT' | 'UPDATE';
    oldValue: string | null;
    newValue: string | null;
    recordId: string | null;
    createdAt: string;
    createdBy: string | null;
  };
};
