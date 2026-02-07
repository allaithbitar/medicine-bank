import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TAddDisclosureNotePayload, TUpdateDisclosureNotePayload } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import useUser from '@/core/hooks/user-user.hook';

type IUpdateDisclosureNoteDto = { type: 'UPDATE'; dto: TUpdateDisclosureNotePayload };

type TInsertDisclosureNoteDto = { type: 'INSERT'; dto: TAddDisclosureNotePayload };

type TDisclosureNoteMutation = TInsertDisclosureNoteDto | IUpdateDisclosureNoteDto;

const useDisclsoureNoteMutation = () => {
  const { id: userId } = useUser();
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureNoteMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureNoteMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddDisclosureNotePayload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { noteAudio, ...restDto } = dto;
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        createdBy: userId,
        ...restDto,
      } as const;
      await localDb.insertInto('disclosure_notes').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_notes',
        status: 'pending',
        recordId: insertDto.id,
        payload: insertDto,
        serverRecordId: null,
        parentId: insertDto.disclosureId,
      });
    },
    [localUpdatesTable, userId]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateDisclosureNotePayload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, noteAudio, ...values } = dto;

      await localDb.updateTable('disclosure_notes').set(values).where('id', '=', id).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_notes',
          status: 'pending',
          recordId: id,
          payload: values,
          serverRecordId: null,
          parentId: values.disclosureId,
        });
      }
    },
    [localUpdatesTable]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TDisclosureNoteMutation) => {
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

export default useDisclsoureNoteMutation;
