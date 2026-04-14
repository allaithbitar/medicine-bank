import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TAddDisclosureDetailsDto, TUpdateDisclosureDetailsDto } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import { useQueryClient } from '@tanstack/react-query';
import { deleteAudioFile, saveAudioFile } from '@/core/helpers/opfs-audio.helpers';
import { getLocalUpdate } from '@/features/offline/hooks/local-update-loader.hook';

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

      let audio: string | null = null;
      if (audioFile && audioFile instanceof Blob) {
        const id = crypto.randomUUID();
        const name = id + '.webm';
        await saveAudioFile(name, audioFile);
        audio = name;
      }

      const insertDto = {
        createdAt: new Date().toISOString(),
        ...restDto,
        audio,
      } as const;

      await localDb.insertInto('disclosure_properties').values(insertDto).execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_properties',
        status: 'pending',
        recordId: insertDto.disclosureId,
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
      const { disclosureId, audioFile, deleteAudioFile: _deleteAudioFile, ...values } = dto;

      const updateEntity = await getLocalUpdate({ parentId: disclosureId, table: 'disclosure_properties' });

      let audio;

      if (audioFile && audioFile instanceof Blob) {
        const audioId = crypto.randomUUID();
        const name = audioId + '.webm';
        await saveAudioFile(name, audioFile);
        audio = name;
      }

      if ((_deleteAudioFile || audioFile) && (updateEntity?.payload as any)?.audio) {
        await deleteAudioFile((updateEntity?.payload as any)?.audio);

        if (_deleteAudioFile) {
          audio = null;
        }
      }

      await localDb
        .updateTable('disclosure_properties')
        .set({
          ...values,
          audio,
        })
        .where('disclosureId', '=', disclosureId)
        .execute();

      if (updateEntity) {
        await localUpdatesTable.updatePayload(updateEntity.id, { ...values, audio });
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_properties',
          status: 'pending',
          recordId: disclosureId,
          payload: { ...values, audio },
          serverRecordId: null,
          parentId: disclosureId,
        });
      }

      //////////////////////////////////////////////////////////////////////////////////
      // let audioName: string | null = null;
      // if (deleteAudioFile) {
      //   audioName = null;
      // } else if (audioFile && audioFile instanceof Blob) {
      //   const id = crypto.randomUUID();
      //   const name = id + '.webm';
      //   await saveAudioFile(name, audioFile);
      //   audioName = name;
      // }
      // const values = {
      //   ...restValues,
      //   ...(deleteAudioFile || audioFile ? { audio: audioName } : {}),
      // };

      // await localDb.updateTable('disclosure_properties').set(values).where('disclosureId', '=', disclosureId).execute();
      //
      // const updateEntity = await localUpdatesTable.getByRecordId(disclosureId);
      //
      // if (updateEntity) {
      //   await localUpdatesTable.updatePayload(updateEntity.id, values);
      // } else {
      //   await localUpdatesTable.create({
      //     operation: 'UPDATE',
      //     table: 'disclosure_properties',
      //     status: 'pending',
      //     recordId: '',
      //     payload: { disclosureId, ...values },
      //     serverRecordId: null,
      //     parentId: disclosureId,
      //   });
      // }

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
