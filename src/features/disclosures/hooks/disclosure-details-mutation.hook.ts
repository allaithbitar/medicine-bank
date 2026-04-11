import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TAddDisclosureDetailsDto, TUpdateDisclosureDetailsDto } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import { useQueryClient } from '@tanstack/react-query';
import { saveAudioFile } from '@/core/helpers/opfs-audio.helpers';

type IUpdateDisclosureDetailsDto = { type: 'UPDATE'; dto: TUpdateDisclosureDetailsDto };

type TInsertDisclosureDetailsDto = { type: 'INSERT'; dto: TAddDisclosureDetailsDto };

type TDisclosureDetailsMutation = TInsertDisclosureDetailsDto | IUpdateDisclosureDetailsDto;

const useDisclosureDetailsMutation = () => {
  const queryClient = useQueryClient();
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureDetailsMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureDetailsMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddDisclosureDetailsDto) => {
      const { audioFile, ...restDto } = dto;

      let audioName: string | null = null;
      if (audioFile && audioFile instanceof Blob) {
        const id = crypto.randomUUID();
        const name = id + '.webm';
        await saveAudioFile(name, audioFile);
        audioName = name;
      }

      const insertDto = {
        createdAt: new Date().toISOString(),
        ...restDto,
        audio: audioName,
      } as const;

      await localDb.insertInto('disclosure_properties').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_properties',
        status: 'pending',
        recordId: '',
        payload: insertDto,
        serverRecordId: null,
        parentId: insertDto.disclosureId,
      });
      queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_PROPERTIES', insertDto.disclosureId],
      });
    },

    [localUpdatesTable, queryClient]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateDisclosureDetailsDto) => {
      const { disclosureId, audioFile, deleteAudioFile, ...restValues } = dto;
      let audioName: string | null = null;
      if (deleteAudioFile) {
        audioName = null;
      } else if (audioFile && audioFile instanceof Blob) {
        const id = crypto.randomUUID();
        const name = id + '.webm';
        await saveAudioFile(name, audioFile);
        audioName = name;
      }
      const values = {
        ...restValues,
        ...(deleteAudioFile || audioFile ? { audio: audioName } : {}),
      };

      await localDb.updateTable('disclosure_properties').set(values).where('disclosureId', '=', disclosureId).execute();

      const updateEntity = await localUpdatesTable.getByRecordId(disclosureId);

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, values);
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_properties',
          status: 'pending',
          recordId: '',
          payload: { disclosureId, ...values },
          serverRecordId: null,
          parentId: disclosureId,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_PROPERTIES', disclosureId],
      });
    },
    [localUpdatesTable, queryClient]
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
