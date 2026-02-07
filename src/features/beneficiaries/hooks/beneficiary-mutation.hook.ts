import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import beneficiaryApi from '../api/beneficiary.api';
import type { TAddBeneficiaryDto, TUpdateBeneficiaryDto } from '../types/beneficiary.types';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';

type IUpdateBeneficiaryDto = { type: 'UPDATE'; dto: TUpdateBeneficiaryDto };

type TInsertBeneficiaryDto = { type: 'INSERT'; dto: TAddBeneficiaryDto };

type TBeneficiaryMutation = TInsertBeneficiaryDto | IUpdateBeneficiaryDto;

const useBeneficiaryMutation = () => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = beneficiaryApi.useUpdateBeneficiaryMutation();
  const [onlineInsert, onlineInsertProperties] = beneficiaryApi.useAddBeneficiaryMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddBeneficiaryDto) => {
      const { phoneNumbers, ...restValues } = dto;
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...restValues,
      } as const;

      await localDb.insertInto('patients').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'patients',
        status: 'pending',
        recordId: insertDto.id,
        payload: restValues,
        serverRecordId: null,
        parentId: null,
      });

      // await localDb
      //   .insertInto('updates')
      //   .values({
      //     id: crypto.randomUUID(),
      //   })
      //   .execute();

      const phoneNumbersInsertDto = phoneNumbers.map((p) => ({
        id: crypto.randomUUID(),
        patientId: insertDto.id,
        phone: p,
      }));

      if (phoneNumbers.length) {
        await localDb.insertInto('patients_phone_numbers').values(phoneNumbersInsertDto).execute();
      }
    },
    [localUpdatesTable]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateBeneficiaryDto) => {
      const { phoneNumbers, id: beneficiaryId, ...restValues } = dto;
      //
      const beneficiary = await localDb
        .selectFrom('patients')
        .selectAll()
        .where('id', '=', beneficiaryId)
        .executeTakeFirst();

      if (!beneficiary) return;

      await localDb.updateTable('patients').set(restValues).where('id', '=', beneficiaryId).execute();

      const oldPatientPhoneNumbers = await localDb
        .selectFrom('patients_phone_numbers')
        .selectAll()
        .where('patientId', '=', beneficiaryId)
        .execute();

      await localDb.deleteFrom('patients_phone_numbers').where('patientId', '=', beneficiaryId).execute();

      const phoneNumbersInsertDto = phoneNumbers.map((p) => {
        let id;
        const oldPhoneNumberRecordIndex = oldPatientPhoneNumbers.findIndex((opp) => opp.phone === p);

        if (oldPhoneNumberRecordIndex !== -1) {
          id = oldPatientPhoneNumbers[oldPhoneNumberRecordIndex].id;
        } else {
          id = crypto.randomUUID();
        }
        return {
          id,
          patientId: beneficiaryId,
          phone: p,
        };
      });

      await localDb.insertInto('patients_phone_numbers').values(phoneNumbersInsertDto).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(beneficiaryId);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, restValues);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'patients',
          status: 'pending',
          recordId: beneficiaryId,
          payload: restValues,
          parentId: null,
          serverRecordId: null,
        });
      }
    },
    [localUpdatesTable]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TBeneficiaryMutation) => {
      switch (payload.type) {
        case 'INSERT': {
          console.warn('1');
          if (isOffline) return handleInsert(payload.dto);

          console.warn('2');
          return onlineInsert(payload.dto).unwrap();
        }
        case 'UPDATE': {
          console.warn('3');
          if (isOffline) return handleUpdate(payload.dto);

          console.warn('4');
          return onlineUpdate(payload.dto).unwrap();
        }
      }
    },
    [handleInsert, handleUpdate, isOffline, onlineInsert, onlineUpdate]
  );

  return [handleMutation, { isLoading: onlineInsertProperties.isLoading || onlineUpdateProperties.isLoading }] as const;
};

export default useBeneficiaryMutation;
