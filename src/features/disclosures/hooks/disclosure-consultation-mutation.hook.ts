import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { localDb } from '@/libs/sqlocal';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type {
  TAddDisclosureAdviserConsultationPayload,
  TUpdateDisclosureAdviserConsultationPayload,
} from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import useUser from '@/core/hooks/user-user.hook';
import { deleteAudioFile, saveAudioFile } from '@/core/helpers/opfs-audio.helpers';
import { useQueryClient } from '@tanstack/react-query';

type IUpdateDisclosureConsultationDto = { type: 'UPDATE'; dto: TUpdateDisclosureAdviserConsultationPayload };

type TInsertDisclosureConsultationDto = { type: 'INSERT'; dto: TAddDisclosureAdviserConsultationPayload };

type TDisclosureConsultationMutation = TInsertDisclosureConsultationDto | IUpdateDisclosureConsultationDto;

const useDisclsoureConsultationMutation = () => {
  const { id: userId } = useUser();
  const queryClient = useQueryClient();
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate, onlineUpdateProperties] = disclosuresApi.useUpdateDisclosureAdviserConsultationMutation();
  const [onlineInsert, onlineInsertProperties] = disclosuresApi.useAddDisclosureAdviserConsultationMutation();
  const isOffline = useIsOffline();

  const handleInsert = useCallback(
    async (dto: TAddDisclosureAdviserConsultationPayload) => {
      const { consultationAudio, ...restDto } = dto;
      const insertDto = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        createdBy: userId,
        consultationStatus: 'pending',
        ...restDto,
      } as const;

      let audioName: string | null = null;
      if (consultationAudio && consultationAudio instanceof Blob) {
        const id = crypto.randomUUID();
        const name = id + '.webm';
        await saveAudioFile(name, consultationAudio);
        audioName = name;
      }

      await localDb
        .insertInto('disclosure_consultations')
        .values({
          ...insertDto,
          consultationAudio: audioName,
        })
        .execute();

      await localUpdatesTable.create({
        operation: 'INSERT',
        table: 'disclosure_consultations',
        status: 'pending',
        recordId: insertDto.id,
        payload: {
          ...insertDto,
          consultationAudio: audioName,
        },
        serverRecordId: null,
        parentId: insertDto.disclosureId,
      });

      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_CONSULTATIONS'],
      });
    },
    [localUpdatesTable, queryClient, userId]
  );

  const handleUpdate = useCallback(
    async (dto: TUpdateDisclosureAdviserConsultationPayload) => {
      const { id, consultationAudio, ...values } = dto;

      const updateEntity = await localUpdatesTable.getByRecordId(id);

      let newConsultationAudio = consultationAudio;

      if (consultationAudio && consultationAudio instanceof Blob) {
        const audioId = crypto.randomUUID();
        const name = audioId + '.webm';
        await saveAudioFile(name, consultationAudio);
        newConsultationAudio = name;
      }

      await localDb
        .updateTable('disclosure_consultations')
        .set({
          ...values,
          ...(typeof newConsultationAudio === 'string' && {
            consultationAudio: newConsultationAudio,
          }),
        })
        .where('id', '=', id)
        .execute();

      if (updateEntity) {
        if (consultationAudio && consultationAudio instanceof Blob) {
          if ((updateEntity.payload as any).consultationAudio) {
            await deleteAudioFile((updateEntity.payload as any).consultationAudio);
          }
        }
        await localUpdatesTable.updatePayload(updateEntity.id, {
          ...values,
          consultationAudio: newConsultationAudio,
        });
      } else {
        await localUpdatesTable.create({
          operation: 'UPDATE',
          table: 'disclosure_consultations',
          status: 'pending',
          recordId: id,
          payload: { ...values, consultationAudio: newConsultationAudio },
          serverRecordId: null,
          parentId: values.disclosureId,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_CONSULTATIONS'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['LOCAL_DISCLOSURE_CONSULTATION', id],
      });
    },

    [localUpdatesTable, queryClient]
  );

  // const handleOnlineUpdate = useCallback(onlineUpdate, []);

  const handleMutation = useCallback(
    (payload: TDisclosureConsultationMutation) => {
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

export default useDisclsoureConsultationMutation;
