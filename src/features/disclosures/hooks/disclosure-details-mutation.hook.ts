import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TAddDisclosureDetailsDto, TUpdateDisclosureDetailsDto } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';

type IUpdateDisclosureDetailsDto = { type: 'UPDATE'; dto: TUpdateDisclosureDetailsDto };

type TInsertDisclosureDetailsDto = { type: 'INSERT'; dto: TAddDisclosureDetailsDto };

type TDisclosureDetailsMutation = TInsertDisclosureDetailsDto | IUpdateDisclosureDetailsDto;

const useDisclosureDetailsMutation = () => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureDetailsMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureDetailsMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddDisclosureDetailsDto) => {
      const insertDto = {
        createdAt: new Date().toISOString(),
        ...dto,
      } as const;
      await localDb.insertInto('disclosure_details').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_details',
        status: 'pending',
        recordId: '',
        payload: insertDto,
        serverRecordId: null,
        parentId: insertDto.disclosureId,
      });
    },
    [localUpdatesTable]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateDisclosureDetailsDto) => {
      const { disclosureId, ...values } = dto;

      await localDb.updateTable('disclosure_details').set(values).where('disclosureId', '=', disclosureId).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(disclosureId);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_details',
          status: 'pending',
          recordId: '',
          payload: dto,
          serverRecordId: null,
          parentId: disclosureId,
        });
      }
    },
    [localUpdatesTable]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TDisclosureDetailsMutation) => {
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

export default useDisclosureDetailsMutation;
