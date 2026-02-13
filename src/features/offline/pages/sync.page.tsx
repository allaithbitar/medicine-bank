import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import offlineApi from '../api/offline.api';
import { localDb } from '@/libs/sqlocal';
import { createTables } from '@/libs/kysely';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import STRINGS from '@/core/constants/strings.constant';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import { getErrorMessage } from '@/core/helpers/helpers';

const SyncPage = () => {
  const [syncLocalData] = offlineApi.useLazySyncQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    const dbTablesDic = {
      employees: 'employees',
      areas_to_employees: 'areasToEmployees',
      patient_medicines: 'patientMedicines',
      medicines: 'medicines',
      patients: 'patients',
      patients_phone_numbers: 'patientsPhoneNumbers',
      family_members: 'familyMembers',
      audit_logs: 'auditLogs',
      disclosure_notes: 'disclosureNotes',
      disclosure_details: 'disclosureDetails',
      disclosures: 'disclosures',
      cities: 'cities',
      areas: 'areas',
      priority_degrees: 'priorityDegrees',
      ratings: 'ratings',
      updates: 'updates',
    } as const;

    try {
      setIsLoading(true);
      const { data } = await syncLocalData({});
      for await (const key of Object.keys(dbTablesDic)) {
        try {
          await localDb.schema.dropTable(key).execute();
        } catch (error) {
          console.warn('some deleted tables dont exist', error);
        }
      }

      await createTables();

      for await (const key of Object.entries(dbTablesDic)) {
        const [dbKey, objKey] = key;
        if (data[objKey] && data[objKey].length) {
          try {
            await localDb
              .insertInto(dbKey as any)
              .values(data[objKey])
              .execute();
          } catch (error) {
            console.warn('some inserted tables failed', error);
          }
        }
      }

      notifySuccess(STRINGS.synced_successfully);
    } catch (error: any) {
      console.log(error);

      notifyError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Stack sx={{ height: '100%', position: 'relative' }} justifyContent="center" alignItems="center">
      {isLoading && <LoadingOverlay spinnerSize={100} />}
      <Button disabled={isLoading} onClick={handleSync}>
        {STRINGS.sync}
      </Button>
    </Stack>
  );
};

export default SyncPage;
