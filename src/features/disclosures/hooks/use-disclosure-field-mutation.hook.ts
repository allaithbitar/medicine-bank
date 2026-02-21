import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { localDb } from '@/libs/sqlocal';
import disclosuresApi from '../api/disclosures.api';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import { useQueryClient } from '@tanstack/react-query';

type TDisclosureFieldKey =
  | 'type'
  | 'status'
  | 'scoutId'
  | 'priorityId'
  | 'initialNote'
  | 'visitNote'
  | 'visitReason'
  | 'visitResult'
  | 'ratingId'
  | 'customRating'
  | 'isCustomRating'
  | 'ratingNote';

const useDisclosureFieldMutation = (disclosureId: string) => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate] = disclosuresApi.useUpdateDisclosureMutation();
  const isOffline = useIsOffline();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const updateField = useCallback(
    async (fieldKey: TDisclosureFieldKey, value: any) => {
      await localDb
        .updateTable('disclosures')
        .set({ [fieldKey]: value })
        .where('id', '=', disclosureId)
        .execute();
      queryClient.invalidateQueries({ queryKey: ['LOCAL_DISCLOSURE', disclosureId] });
      if (isOffline) {
        const updateEntity = await localUpdatesTable.getByRecordId(disclosureId);
        if (updateEntity) {
          const existingPayload =
            typeof updateEntity.payload === 'string' ? JSON.parse(updateEntity.payload) : updateEntity.payload;
          await localUpdatesTable.updatePayload(updateEntity.id, {
            ...existingPayload,
            [fieldKey]: value,
          });
        } else {
          await localUpdatesTable.create({
            operation: 'UPDATE',
            table: 'disclosures',
            status: 'pending',
            recordId: disclosureId,
            payload: { [fieldKey]: value },
            parentId: null,
            serverRecordId: null,
          });
        }
        return;
      }
      const patchResult = dispatch(
        disclosuresApi.util.updateQueryData('getDisclosure', { id: disclosureId }, (draft) => {
          (draft as any)[fieldKey] = value;
        }) as any
      ) as any;
      try {
        await onlineUpdate({
          id: disclosureId,
          [fieldKey]: value,
        }).unwrap();
      } catch (error) {
        patchResult.undo();
        throw error;
      }
    },
    [disclosureId, isOffline, localUpdatesTable, onlineUpdate, queryClient, dispatch]
  );

  return updateField;
};

export default useDisclosureFieldMutation;
