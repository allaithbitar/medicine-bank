import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';
import type { TBeneficiaryMedicine } from '../types/beneficiary.types';
import { ParseJSONResultsPlugin } from 'kysely';

export const useLocalBeneficiaryMedicineLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_BENEFICIARY_MEDICINE', id, forceOffline],
    queryFn: async () => {
      return (await localDb
        .selectFrom('patient_medicines')
        .selectAll()
        .select((col) => [
          jsonObjectFrom(
            col
              .selectFrom('medicines')
              .select(['medicines.id', 'medicines.name', 'medicines.form', 'medicines.doseVariants'])
              .whereRef('medicines.id', '=', 'patient_medicines.medicineId')
          ).as('medicine'),
        ])
        .withPlugin(new ParseJSONResultsPlugin())

        .where('id', '=', id!)
        .executeTakeFirstOrThrow()) as TBeneficiaryMedicine;
    },
    enabled: isOffline && !!id,
  });
  return queryResult;
};
