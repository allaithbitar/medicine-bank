import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import disclosuresApi from '../api/disclosures.api';
import type { TAddSubPatientDto, TUpdateSubPatientDto } from '../types/disclosure.types';
import { useQueryClient } from '@tanstack/react-query';

type IUpdateDisclosureSubPatientDto = { type: 'UPDATE'; dto: TUpdateSubPatientDto };

type TInsertDisclosureSubPatientDto = { type: 'INSERT'; dto: TAddSubPatientDto };

type TDisclosureSubPatientMutation = TInsertDisclosureSubPatientDto | IUpdateDisclosureSubPatientDto;

const useDisclosureSubPatientMutation = () => {
  const queryClient = useQueryClient();
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureSubPatientMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureSubPatientMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddSubPatientDto) => {
      const insertDto = {
        id: crypto.randomUUID(),
        ...dto,
      } as const;
      await localDb.insertInto('disclosure_sub_patients').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_sub_patients',
        status: 'pending',
        recordId: insertDto.id,
        payload: insertDto,
        serverRecordId: null,
        parentId: insertDto.disclosureId,
      });

      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_SUB_PATIENTS'],
      });
    },
    [localUpdatesTable, queryClient]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateSubPatientDto) => {
      console.log('hi');

      const { id, ...values } = dto;

      await localDb.updateTable('disclosure_sub_patients').set(values).where('id', '=', id).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_sub_patients',
          status: 'pending',
          recordId: id,
          payload: dto,
          serverRecordId: null,
          parentId: dto.disclosureId,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_SUB_PATIENTS'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_SUB_PATIENT', id],
      });
    },
    [localUpdatesTable, queryClient]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TDisclosureSubPatientMutation) => {
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

export default useDisclosureSubPatientMutation;
