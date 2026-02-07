import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import disclosuresApi from '../api/disclosures.api';
import type { TAddDisclosureDto, TUpdateDisclosureDto } from '../types/disclosure.types';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';

type IUpdateDisclosureDto = { type: 'UPDATE'; dto: TUpdateDisclosureDto };

type TInsertDisclosureDto = { type: 'INSERT'; dto: TAddDisclosureDto };

type TDisclosureMutation = TInsertDisclosureDto | IUpdateDisclosureDto;

const useDisclosureMutation = () => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddDisclosureDto) => {
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: 'active',
        ...dto,
      } as const;

      await localDb.insertInto('disclosures').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosures',
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
    async (dto: TUpdateDisclosureDto) => {
      const { id, ...values } = dto;

      await localDb.updateTable('disclosures').set(values).where('id', '=', id).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      if (updateEntity) {
        localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosures',
          status: 'pending',
          recordId: id,
          payload: values,
          parentId: null,
          serverRecordId: null,
        });
      }
    },
    [localUpdatesTable]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TDisclosureMutation) => {
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

export default useDisclosureMutation;
