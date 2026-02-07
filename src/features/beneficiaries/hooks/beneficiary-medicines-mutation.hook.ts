import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TAddBeneficiaryMedicinePayload, TUpdateBeneficiaryMedicinePayload } from '../types/beneficiary.types';
import beneficiaryApi from '../api/beneficiary.api';

type IUpdateBeneficiaryMedicineDto = { type: 'UPDATE'; dto: TUpdateBeneficiaryMedicinePayload };

type TInsertBeneficiaryMedicineDto = { type: 'INSERT'; dto: TAddBeneficiaryMedicinePayload };

type TBeneficiaryMedicineMutation = TInsertBeneficiaryMedicineDto | IUpdateBeneficiaryMedicineDto;

const useBeneficiaryMedicineMutation = () => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = beneficiaryApi.useUpdateBeneficiaryMedicineMutation();
  const [onlineInsert, onlineInsertProperties] = beneficiaryApi.useAddBeneficiaryMedicineMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddBeneficiaryMedicinePayload) => {
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...dto,
      } as const;
      await localDb.insertInto('patient_medicines').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'patient_medicines',
        status: 'pending',
        recordId: insertDto.id,
        payload: insertDto,
        serverRecordId: null,
        parentId: dto.patientId,
      });
    },
    [localUpdatesTable]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateBeneficiaryMedicinePayload) => {
      const { id, ...values } = dto;

      await localDb.updateTable('patient_medicines').set(values).where('id', '=', id).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'patient_medicines',
          status: 'pending',
          recordId: id,
          payload: values,
          serverRecordId: null,
          parentId: values.patientId,
        });
      }
    },
    [localUpdatesTable]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TBeneficiaryMedicineMutation) => {
      switch (payload.type) {
        case 'INSERT': {
          if (isOffline) return handleInsert(payload.dto);
          return onlineInsert(payload.dto).unwrap();
        }
        case 'UPDATE': {
          if (isOffline) return handleUpdate(payload.dto);
          return onlineUpdate(payload.dto).unwrap();
        }
      }
    },
    [handleInsert, handleUpdate, isOffline, onlineInsert, onlineUpdate]
  );

  return [handleMutation, { isLoading: onlineInsertProperties.isLoading || onlineUpdateProperties.isLoading }] as const;
};

export default useBeneficiaryMedicineMutation;
