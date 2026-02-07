import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import beneficiaryApi from '../api/beneficiary.api';
import type { TAddFamilyMemberPayload, TUpdateFamilyMemberPayload } from '../types/beneficiary.types';

type IUpdateFamilyMemberDto = { type: 'UPDATE'; dto: TUpdateFamilyMemberPayload };

type TInsertFamilyMemberDto = { type: 'INSERT'; dto: TAddFamilyMemberPayload };

type TFamilyMemberMutation = TInsertFamilyMemberDto | IUpdateFamilyMemberDto;

const useFamilyMembersMutation = () => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = beneficiaryApi.useUpdateFamilyMemberMutation();
  const [onlineInsert, onlineInsertProperties] = beneficiaryApi.useAddFamilyMemberMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddFamilyMemberPayload) => {
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...dto,
      } as const;
      await localDb.insertInto('family_members').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'family_members',
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
    async (dto: TUpdateFamilyMemberPayload) => {
      const { id, ...values } = dto;

      await localDb.updateTable('family_members').set(values).where('id', '=', id).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'family_members',
          status: 'pending',
          recordId: id,
          payload: values,
          serverRecordId: null,
          parentId: dto.patientId,
        });
      }
    },
    [localUpdatesTable]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TFamilyMemberMutation) => {
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

export default useFamilyMembersMutation;
