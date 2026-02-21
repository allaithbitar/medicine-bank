import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { localDb } from '@/libs/sqlocal';
import beneficiaryApi from '../api/beneficiary.api';
import useLocalUpdatesTable from '@/features/offline/hooks/local-updates-table.hook';
import type { TBenefieciary } from '../types/beneficiary.types';
import { useQueryClient } from '@tanstack/react-query';
import disclosuresApi from '@/features/disclosures/api/disclosures.api';

type TBeneficiaryFieldKey = 'name' | 'nationalNumber' | 'address' | 'areaId' | 'birthDate' | 'gender' | 'job' | 'about';

type TUseBeneficiaryFieldMutationOptions = {
  disclosureId?: string;
};

const useBeneficiaryFieldMutation = (beneficiary: TBenefieciary, options?: TUseBeneficiaryFieldMutationOptions) => {
  const localUpdatesTable = useLocalUpdatesTable();
  const [onlineUpdate] = beneficiaryApi.useUpdateBeneficiaryMutation();
  const isOffline = useIsOffline();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const updateField = useCallback(
    async (fieldKey: TBeneficiaryFieldKey, value: any) => {
      await localDb
        .updateTable('patients')
        .set({ [fieldKey]: value })
        .where('id', '=', beneficiary.id)
        .execute();
      queryClient.invalidateQueries({ queryKey: ['LOCAL_BENEFICIARY', beneficiary.id] });

      if (isOffline) {
        const updateEntity = await localUpdatesTable.getByRecordId(beneficiary.id);
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
            table: 'patients',
            status: 'pending',
            recordId: beneficiary.id,
            payload: { [fieldKey]: value },
            parentId: null,
            serverRecordId: null,
          });
        }
        return;
      }
      const patchResult = dispatch(
        beneficiaryApi.util.updateQueryData('getBeneficiary', { id: beneficiary.id }, (draft) => {
          (draft as any)[fieldKey] = value;
        }) as any
      ) as any;
      let disclosurePatchResult: any = null;
      if (options?.disclosureId) {
        disclosurePatchResult = dispatch(
          disclosuresApi.util.updateQueryData('getDisclosure', { id: options.disclosureId }, (draft) => {
            if (draft.patient) {
              (draft.patient as any)[fieldKey] = value;
            }
          }) as any
        ) as any;
      }
      try {
        await onlineUpdate({
          id: beneficiary.id,
          name: beneficiary.name,
          phoneNumbers: beneficiary.phones?.map((p) => p.phone) ?? [],
          nationalNumber: beneficiary.nationalNumber,
          areaId: beneficiary.areaId,
          address: beneficiary.address,
          about: beneficiary.about,
          birthDate: beneficiary.birthDate,
          job: beneficiary.job,
          gender: beneficiary.gender,
          [fieldKey]: value,
        }).unwrap();
      } catch (error) {
        patchResult.undo();
        if (disclosurePatchResult) {
          disclosurePatchResult.undo();
        }
        throw error;
      }
    },
    [beneficiary, isOffline, localUpdatesTable, onlineUpdate, queryClient, dispatch, options]
  );

  return updateField;
};

export default useBeneficiaryFieldMutation;
