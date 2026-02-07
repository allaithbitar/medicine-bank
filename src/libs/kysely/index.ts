import { localDb } from '../sqlocal';

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
    .createTable('cities')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('areas')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('cityId', 'uuid', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('employees')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('phone', 'text', (col) => col.notNull())
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime')
    .execute();

  await localDb.schema
    .createTable('areas_to_employees')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('employeeId', 'uuid', (col) => col.notNull())
    .addColumn('areaId', 'uuid', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('patients')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('nationalNumber', 'text')
    .addColumn('birthDate', 'date')
    .addColumn('gender', 'text')
    .addColumn('job', 'text')
    .addColumn('address', 'text')
    .addColumn('about', 'text')
    .addColumn('areaId', 'uuid')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime')
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('family_members')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('birthDate', 'text', (col) => col.notNull())
    .addColumn('gender', 'text', (col) => col.notNull())
    .addColumn('nationalNumber', 'text')
    .addColumn('kinshep', 'text', (col) => col.notNull())
    .addColumn('jobOrSchool', 'text')
    .addColumn('residential', 'text')
    .addColumn('note', 'text')
    .addColumn('kidsCount', 'integer')
    .addColumn('patientId', 'uuid', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime')
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('medicines')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('form', 'text', (col) => col.notNull())
    .addColumn('doseVariants', 'json', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('patient_medicines')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('patientId', 'uuid', (col) => col.notNull())
    .addColumn('medicineId', 'uuid', (col) => col.notNull())
    .addColumn('dosePerIntake', 'real')
    .addColumn('intakeFrequency', 'text')
    .addColumn('note', 'text')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime')
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('patients_phone_numbers')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('patientId', 'uuid', (col) => col.notNull())
    .addColumn('phone', 'text', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('priority_degrees')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('color', 'text')
    .addColumn('durationInDays', 'integer')
    .execute();

  await localDb.schema
    .createTable('ratings')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('code', 'text', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('disclosures')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('priorityId', 'uuid', (col) => col.notNull())
    .addColumn('patientId', 'uuid', (col) => col.notNull())
    .addColumn('scoutId', 'uuid')
    .addColumn('initialNote', 'text')
    .addColumn('isReceived', 'boolean')
    .addColumn('archiveNumber', 'integer')
    .addColumn('visitResult', 'text')
    .addColumn('visitReason', 'text')
    .addColumn('visitNote', 'text')
    .addColumn('ratingId', 'uuid')
    .addColumn('isCustomRating', 'boolean')
    .addColumn('customRating', 'text')
    .addColumn('ratingNote', 'text')
    .addColumn('appointmentDate', 'date')
    .addColumn('isAppointmentCompleted', 'boolean')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime')
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('disclosure_notes')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('noteAudio', 'text')
    .addColumn('noteText', 'text')
    .addColumn('disclosureId', 'uuid', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedAt', 'datetime')
    .execute();
  // houseOwnership: house_ownership_status("house_ownership"),
  // houseOwnershipNote: text("house_ownership_note"),
  // houseCondition: house_hold_asset_condition_enum("house_condition"),
  // houseConditionNote: text("house_condition_note"),
  // pros: text("pros"),
  // cons: text("cons"),
  // other: text("other"),
  await localDb.schema
    .createTable('disclosure_details')
    .ifNotExists()
    .addColumn('disclosureId', 'uuid', (col) => col.primaryKey())
    .addColumn('diseasesOrSurgeries', 'text')
    .addColumn('jobOrSchool', 'text')
    .addColumn('electricity', 'text')
    .addColumn('expenses', 'text')
    .addColumn('houseOwnership', 'text')
    .addColumn('houseOwnershipNote', 'text')
    .addColumn('houseCondition', 'text')
    .addColumn('houseConditionNote', 'text')
    .addColumn('pros', 'text')
    .addColumn('cons', 'text')
    .addColumn('other', 'text')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedAt', 'datetime')
    .addColumn('updatedBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('notifications')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('from', 'uuid', (col) => col.notNull())
    .addColumn('to', 'uuid', (col) => col.notNull())
    .addColumn('text', 'text')
    .addColumn('recordId', 'uuid')
    .addColumn('readAt', 'datetime')
    .execute();

  await localDb.schema
    .createTable('system_broadcasts')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('title', 'text')
    .addColumn('details', 'text')
    .addColumn('audience', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('meetings')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('note', 'text')
    .addColumn('date', 'datetime')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('disclosure_consultations')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('disclosureId', 'uuid', (col) => col.notNull())
    .addColumn('consultationStatus', 'text', (col) => col.notNull())
    .addColumn('consultedBy', 'uuid')
    .addColumn('consultationNote', 'text')
    .addColumn('consultationAudio', 'text')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime')
    .addColumn('createdBy', 'uuid')
    .addColumn('updatedBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('audit_logs')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('table', 'text', (col) => col.notNull())
    .addColumn('column', 'text')
    .addColumn('action', 'text')
    .addColumn('oldValue', 'text')
    .addColumn('newValue', 'text')
    .addColumn('recordId', 'uuid')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('createdBy', 'uuid')
    .execute();

  await localDb.schema
    .createTable('updates')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('recordId', 'text', (col) => col.notNull())
    .addColumn('table', 'text', (col) => col.notNull())
    .addColumn('operation', 'text', (col) => col.notNull())
    .addColumn('payload', 'json')
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('serverRecordId', 'text')
    .addColumn('parentId', 'text')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .execute();

  await localDb.schema
    .createTable('id_mappings')
    .ifNotExists()
    .addColumn('localId', 'text', (col) => col.primaryKey())
    .addColumn('serverId', 'text', (col) => col.notNull())
    .addColumn('table', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .execute();
}
