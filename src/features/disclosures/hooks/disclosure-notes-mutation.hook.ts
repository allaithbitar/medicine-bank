import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TAddDisclosureNotePayload, TUpdateDisclosureNotePayload } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import useUser from '@/core/hooks/user-user.hook';
import { deleteAudioFile, saveAudioFile } from '@/core/helpers/opfs-audio.helpers';
import { useQueryClient } from '@tanstack/react-query';

type IUpdateDisclosureNoteDto = { type: 'UPDATE'; dto: TUpdateDisclosureNotePayload };

type TInsertDisclosureNoteDto = { type: 'INSERT'; dto: TAddDisclosureNotePayload };

type TDisclosureNoteMutation = TInsertDisclosureNoteDto | IUpdateDisclosureNoteDto;

const useDisclsoureNoteMutation = () => {
  const { id: userId } = useUser();
  const queryClient = useQueryClient();
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureNoteMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureNoteMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddDisclosureNotePayload) => {
      const { noteAudio, ...restDto } = dto;
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        createdBy: userId,
        ...restDto,
      } as const;

      let audioName: string | null = null;
      if (noteAudio && noteAudio instanceof Blob) {
        const id = crypto.randomUUID();
        const name = id + '.webm';
        await saveAudioFile(name, noteAudio);
        audioName = name;
      }

      await localDb
        .insertInto('disclosure_notes')
        .values({
          ...insertDto,
          noteAudio: audioName,
        })
        .execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_notes',
        status: 'pending',
        recordId: insertDto.id,
        payload: {
          ...insertDto,
          noteAudio: audioName,
        },
        serverRecordId: null,
        parentId: insertDto.disclosureId,
      });

      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_NOTES'],
      });
    },
    [localUpdatesTable, queryClient, userId]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateDisclosureNotePayload) => {
      const { id, noteAudio, ...values } = dto;

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      let newNoteAudio = noteAudio;

      if (noteAudio && noteAudio instanceof Blob) {
        const audioId = crypto.randomUUID();
        const name = audioId + '.webm';
        await saveAudioFile(name, noteAudio);
        newNoteAudio = name;
      }

      await localDb
        .updateTable('disclosure_notes')
        .set({
          ...values,
          ...(typeof newNoteAudio === 'string' && {
            noteAudio: newNoteAudio,
          }),
        })
        .where('id', '=', id)
        .execute();

      if (updateEntity) {
        if (noteAudio && noteAudio instanceof Blob) {
          if ((updateEntity.payload as any).noteAudio) {
            const deleteResult = await deleteAudioFile((updateEntity.payload as any).noteAudio);
            console.log({ deleteResult });
          }
        }
        await localUpdatesTable.updatePayload(updateEntity.id, { ...values, noteAudio: newNoteAudio });
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_notes',
          status: 'pending',
          recordId: id,
          payload: { ...values, noteAudio: newNoteAudio },
          serverRecordId: null,
          parentId: values.disclosureId,
        });
      }

      // queryKey: ['LOCAL_DISCLOSURE_NOTE', id, forceOffline],
      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_NOTES'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_NOTE', id],
      });
    },

    [localUpdatesTable, queryClient]
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
