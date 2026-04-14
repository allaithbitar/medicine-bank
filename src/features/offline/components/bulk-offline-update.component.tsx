import type { TOfflineUpdate } from '@/core/types/common.types';
import type {
  TAddBeneficiaryDto,
  TAddBeneficiaryMedicinePayload,
  TAddFamilyMemberPayload,
} from '@/features/beneficiaries/types/beneficiary.types';
import useLocalUpdatesTable from '../hooks/local-updates-table.hook';
import beneficiaryApi from '@/features/beneficiaries/api/beneficiary.api';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import { getErrorMessage } from '@/core/helpers/helpers';
import { getLocalUpdate } from '../hooks/local-update-loader.hook';
import type {
  TAddDisclosureAdviserConsultationPayload,
  TAddDisclosureDetailsDto,
  TAddDisclosureDto,
  TAddDisclosureNotePayload,
  TAddSubPatientDto,
} from '@/features/disclosures/types/disclosure.types';
import { localDb } from '@/libs/sqlocal';
import { getLocalDisclosure } from '@/features/disclosures/hooks/local-disclosure-loader.hook';
import disclosuresApi from '@/features/disclosures/api/disclosures.api';
import { compareObjects } from '@/core/utils/conflict-diff.util';
import { getLocalBeneficiary } from '@/features/beneficiaries/hooks/local-beneficiary.loader';
import { getLocalFamilyMember } from '@/features/beneficiaries/hooks/local-beneficiary-family-member-loader.hook';
import { getLocalDisclosureDetails } from '@/features/disclosures/hooks/local-disclosure-details-loader.hook';
import { getLocalDisclosureNote } from '@/features/disclosures/hooks/local-disclosure-note-loader.hook';
import { deleteAudioFile, readAudioFile } from '@/core/helpers/opfs-audio.helpers';
import { getLocalBeneficiaryMedicine } from '@/features/beneficiaries/hooks/local-beneficiary-medicine-loader.hook';
import { getLocalDisclosureConsultation } from '@/features/disclosures/hooks/local-disclosure-consultaion-loader.hook';
import { getLocalDisclosureSubPatient } from '@/features/disclosures/hooks/local-disclosure-sub-patient-loader.hook';
import { useLocalUpdatesLoader } from '../hooks/local-updates-loader.hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import STRINGS from '@/core/constants/strings.constant';

const useBulkOfflineUpdate = () => {
  const { data: updates } = useLocalUpdatesLoader();
  const localUpdateTable = useLocalUpdatesTable();
  const [addBeneficiary, { isLoading: isAddingBeneficiary }] = beneficiaryApi.useAddBeneficiaryMutation();
  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] = beneficiaryApi.useUpdateBeneficiaryMutation();
  const [getOnlineDisclosureData, { isLoading: isGettingOnlineDisclosure }] =
    disclosuresApi.useLazyGetDisclosureQuery();
  const [addDisclosure, { isLoading: isAddingDisclosure }] = disclosuresApi.useAddDisclosureMutation();
  const [updateDisclosure, { isLoading: isUpdatingDisclosure }] = disclosuresApi.useUpdateDisclosureMutation();
  const [getOnlineFamilyMemberData, { isLoading: isGettingFamilyMember }] =
    beneficiaryApi.useLazyGetFamilyMemberByIdQuery();
  const [addFamilyMember, { isLoading: isAddingFamilyMember }] = beneficiaryApi.useAddFamilyMemberMutation();
  const [updateFamilyMember, { isLoading: isUpdatingFamilyMember }] = beneficiaryApi.useUpdateFamilyMemberMutation();
  const [getOnlineDisclosureDetails, { isLoading: isGettingOnlineDisclosureDetailsData }] =
    disclosuresApi.useLazyGetDisclosureDetailsQuery();
  const [addDisclosureDetails, { isLoading: isAddingDisclosureDetails }] =
    disclosuresApi.useAddDisclosureDetailsMutation();

  const [updateDisclosureDetails, { isLoading: isUpdatingDisclosureDetails }] =
    disclosuresApi.useUpdateDisclosureDetailsMutation();
  const [getOnlineDisclosureNoteData, { isLoading: isGettingOnlineDisclosureNoteData }] =
    disclosuresApi.useLazyGetDisclosureNoteByIdQuery();
  const [addDisclosureNote, { isLoading: isAddingDisclosureNote }] = disclosuresApi.useAddDisclosureNoteMutation();

  const [updateDisclosureNote, { isLoading: isUpdatingDisclosureNote }] =
    disclosuresApi.useUpdateDisclosureNoteMutation();

  const [getOnlineBeneficiaryMedicineData, { isLoading: isGettingOnlineBeneficiaryMedicineData }] =
    beneficiaryApi.useLazyGetBeneficiaryMedicineByIdQuery();

  const [addBeneficiaryMedicine, { isLoading: isAddingBeneficirayMedicine }] =
    beneficiaryApi.useAddBeneficiaryMedicineMutation();
  const [updateBeneficiaryMedicine, { isLoading: isUpdatingBeneficiaryMedicine }] =
    beneficiaryApi.useUpdateBeneficiaryMedicineMutation();

  const [getOnlineDisclosureConsultationData, { isLoading: isGettingOnlineDisclosureConsultationData }] =
    disclosuresApi.useLazyGetDisclosureAdviserConsultationByIdQuery();

  const [addDisclosureConsultation, { isLoading: isAddingDisclosureConsultation }] =
    disclosuresApi.useAddDisclosureAdviserConsultationMutation();

  const [updateDisclosureConsultation, { isLoading: isUpdatingDisclosureConsultation }] =
    disclosuresApi.useUpdateDisclosureAdviserConsultationMutation();

  const [getOnlineDisclosureSubPatientData, { isFetching: isFetchingOnlineDisclosureSubPatient }] =
    disclosuresApi.useLazyGetDisclosureSubPatientByIdQuery();

  const [addDisclosureSubPatient, { isLoading: isAddingDisclosureSubPatient }] =
    disclosuresApi.useAddDisclosureSubPatientMutation();

  const [updateDisclosureSubPatient, { isLoading: isUpdatingDisclosureSubPatient }] =
    disclosuresApi.useUpdateDisclosureSubPatientMutation();

  // const handleSaveFamilyMemberUpdate = async (update: TOfflineUpdate) => {
  //   const { data: onlineFamilyMemberData } = await getOnlineFamilyMemberData({ id: update.recordId });
  //   const localFamilyMemberData = await getLocalFamilyMember(update.recordId);
  //   const parentBeneficiaryUpdateData = await getLocalUpdate({
  //     recordId: update?.parentId ?? '',
  //   });
  //   const _diffs = compareObjects(localFamilyMemberData || {}, onlineFamilyMemberData || {}, {});
  //
  //   const dto = _diffs
  //     .filter((d) => d.hasConflict)
  //     .reduce((acc, curr) => {
  //       if (curr.field in update.payload) {
  //         acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
  //       } else {
  //         console.warn(curr.field, curr.localValue);
  //       }
  //
  //       return acc;
  //     }, {} as TAddFamilyMemberPayload);
  //
  //   try {
  //     let serverRecordId = '';
  //     if (update.operation === 'INSERT') {
  //       if (parentBeneficiaryUpdateData) {
  //         dto.patientId = (parentBeneficiaryUpdateData.serverRecordId || dto.patientId || update.parentId!) ?? '';
  //       }
  //
  //       const addedFamilyMember = await addFamilyMember(dto).unwrap();
  //       serverRecordId = addedFamilyMember.id;
  //     } else {
  //       await updateFamilyMember({
  //         ...dto,
  //         id: update.recordId,
  //         patientId: onlineFamilyMemberData?.patientId ?? '',
  //       }).unwrap();
  //       serverRecordId = update.recordId!;
  //     }
  //     await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
  //     // notifySuccess(STRINGS.action_done_successfully);
  //   } catch (error: any) {
  //     notifyError(getErrorMessage(error));
  //   }
  // };

  // const handleSaveDisclosureNotesUpdate = async (update: TOfflineUpdate) => {
  //   const parentDisclosureLocalUpdate = await getLocalUpdate({
  //     recordId: update?.parentId ?? '',
  //     operation: 'INSERT',
  //   });
  //
  //   const localDisclosureNoteData = await getLocalDisclosureNote(update.recordId || '');
  //   const { data: onlineDisclosureNoteData } = await getOnlineDisclosureNoteData(update.recordId || '');
  //   const _diffs = compareObjects(localDisclosureNoteData || {}, onlineDisclosureNoteData || {}, {});
  //
  //   let _newNoteAudio: string | Blob | null | undefined = null;
  //
  //   let _noteAudioToDelete = '';
  //   const dto = _diffs
  //     .filter((d) => d.hasConflict)
  //     .reduce((acc, curr) => {
  //       if (curr.field in update.payload) {
  //         acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
  //       } else {
  //         console.warn(curr.field, curr.localValue);
  //       }
  //
  //       return acc;
  //     }, {} as TAddDisclosureNotePayload);
  //
  //   try {
  //     let serverRecordId = '';
  //     if (update.operation === 'INSERT') {
  //       _newNoteAudio = dto.noteAudio;
  //       if (_newNoteAudio && typeof _newNoteAudio === 'string') {
  //         const _opfsAudioFile = await readAudioFile(_newNoteAudio);
  //         if (_opfsAudioFile) {
  //           dto.noteAudio = _opfsAudioFile;
  //         }
  //       }
  //       if (parentDisclosureLocalUpdate) {
  //         dto.disclosureId = (parentDisclosureLocalUpdate.serverRecordId || dto.disclosureId || update.parentId!) ?? '';
  //       }
  //
  //       await addDisclosureNote(dto).unwrap();
  //       if (_newNoteAudio && typeof _newNoteAudio === 'string') {
  //         _noteAudioToDelete = _newNoteAudio;
  //       }
  //       serverRecordId = dto.disclosureId;
  //     } else {
  //       if (dto.noteAudio && typeof dto.noteAudio === 'string') {
  //         const _opfsAudioFile = await readAudioFile(dto.noteAudio);
  //         if (_opfsAudioFile) {
  //           _noteAudioToDelete = dto.noteAudio;
  //           dto.noteAudio = _opfsAudioFile;
  //         }
  //       }
  //
  //       await updateDisclosureNote({
  //         ...dto,
  //         id: update.recordId,
  //         disclosureId: update.parentId!,
  //       }).unwrap();
  //       serverRecordId = update.parentId!;
  //     }
  //     if (_noteAudioToDelete) {
  //       await deleteAudioFile(_noteAudioToDelete);
  //     }
  //     await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
  //     // notifySuccess(STRINGS.action_done_successfully);
  //   } catch (error: any) {
  //     notifyError(getErrorMessage(error));
  //   }
  // };

  // const handleSaveBeneficiaryMedicineUpdate = async (update: TOfflineUpdate) => {
  //   const parentBeneficiaryLocalUpdate = await getLocalUpdate({
  //     recordId: update?.parentId ?? '',
  //     operation: 'INSERT',
  //   });
  //
  //   const localBeneficiaryMedicineData = await getLocalBeneficiaryMedicine(update.recordId || '');
  //   const { data: onlineBeneficiaryMedicineData } = await getOnlineBeneficiaryMedicineData({
  //     id: update.recordId || '',
  //   });
  //   const _diffs = compareObjects(localBeneficiaryMedicineData || {}, onlineBeneficiaryMedicineData || {}, {});
  //
  //   const dto = _diffs
  //     .filter((d) => d.hasConflict)
  //     .reduce((acc, curr) => {
  //       if (curr.field in update.payload) {
  //         acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
  //       } else {
  //         console.warn(curr.field, curr.localValue);
  //       }
  //
  //       return acc;
  //     }, {} as TAddBeneficiaryMedicinePayload);
  //
  //   try {
  //     let serverRecordId = '';
  //     if (update.operation === 'INSERT') {
  //       if (parentBeneficiaryLocalUpdate) {
  //         dto.patientId = (parentBeneficiaryLocalUpdate.serverRecordId || dto.patientId || update.parentId!) ?? '';
  //       }
  //
  //       const addedFamilyMember = await addBeneficiaryMedicine(dto).unwrap();
  //       serverRecordId = addedFamilyMember.id;
  //     } else {
  //       await updateBeneficiaryMedicine({
  //         ...dto,
  //         id: update.recordId,
  //         medicineId: (update?.payload as any).medicineId ?? '',
  //         patientId: onlineBeneficiaryMedicineData?.patientId ?? '',
  //       }).unwrap();
  //       serverRecordId = update.recordId!;
  //     }
  //     await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
  //     // notifySuccess(STRINGS.action_done_successfully);
  //   } catch (error: any) {
  //     notifyError(getErrorMessage(error));
  //   }
  // };

  const handleSavePatientUpdate = async (update: TOfflineUpdate) => {
    const dto = update.payload as TAddBeneficiaryDto;
    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        const addedBeneficiary = await addBeneficiary(dto).unwrap();
        serverRecordId = addedBeneficiary.id;
      } else {
        await updateBeneficiary({ ...dto, id: update.recordId }).unwrap();
        serverRecordId = update.recordId;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const handleSaveDisclosureUpdate = async (update: TOfflineUpdate) => {
    const localDisclosureData = await getLocalDisclosure(update.recordId);

    const parentBeneficiaryLocalUpdate = await getLocalUpdate({
      recordId: localDisclosureData?.patientId ?? '',
      operation: 'INSERT',
    });

    const { data: onlineDisclosureData } = await getOnlineDisclosureData({ id: update.recordId });

    const _diffs = compareObjects(localDisclosureData || {}, onlineDisclosureData || {}, {});

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }

        return acc;
      }, {} as TAddDisclosureDto);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        if (parentBeneficiaryLocalUpdate) {
          dto.patientId = parentBeneficiaryLocalUpdate.serverRecordId ?? dto.patientId;
        }
        const addedBeneficiary = await addDisclosure(dto).unwrap();
        serverRecordId = addedBeneficiary.id;
      } else {
        await updateDisclosure({ ...dto, id: update.recordId }).unwrap();
        serverRecordId = update.recordId;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
      // notifySuccess(STRINGS.action_done_successfully);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const handleSaveDisclosurePropertiesUpdate = async (update: TOfflineUpdate) => {
    const localDisclosureDetailsData = await getLocalDisclosureDetails(update.parentId || '');

    const { data: onlineDisclosureDetailsData } = await getOnlineDisclosureDetails({
      disclosureId: update.parentId || '',
    });

    const parentDisclosureLocalUpdate = await getLocalUpdate({
      recordId: update?.parentId ?? '',
      operation: 'INSERT',
      table: 'disclosures',
    });

    const _diffs = compareObjects(localDisclosureDetailsData || {}, onlineDisclosureDetailsData || {}, {});

    let _newAudio: string | Blob | null | undefined = null;

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce(
        (acc, curr) => {
          if (curr.field in update.payload) {
            acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
          } else {
            console.warn(curr.field, curr.localValue);
          }

          return acc;
        },
        {} as TAddDisclosureDetailsDto & { audio: string | null }
      );

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        _newAudio = dto.audio;
        if (_newAudio && typeof _newAudio === 'string') {
          const _opfsAudioFile = await readAudioFile(_newAudio);
          if (_opfsAudioFile) {
            dto.audioFile = _opfsAudioFile;
          }
        }
        if (parentDisclosureLocalUpdate) {
          dto.disclosureId = (parentDisclosureLocalUpdate.serverRecordId || dto.disclosureId || update.parentId!) ?? '';
        }
        await addDisclosureDetails(dto).unwrap();
        serverRecordId = dto.disclosureId;
      } else {
        if (dto.audio && typeof dto.audio === 'string') {
          const _opfsAudioFile = await readAudioFile(dto.audio);
          if (_opfsAudioFile) {
            dto.audioFile = _opfsAudioFile;
          }
        }

        if (!dto.disclosureId) {
          dto.disclosureId = update.parentId || (update.payload as any).disclosureId || '';
        }
        await updateDisclosureDetails(dto).unwrap();
        serverRecordId = update.parentId!;
      }

      if (dto.audio) {
        await deleteAudioFile(dto.audio);
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
      // notifySuccess(STRINGS.action_done_successfully);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const handleSaveDisclosureConsultationUpdate = async (update: TOfflineUpdate) => {
    const localDisclosureConsultationData = await getLocalDisclosureConsultation(update.recordId);

    const { data: onlineDisclosureConsultationData } = await getOnlineDisclosureConsultationData({
      id: update.recordId,
    });

    const parentDisclosureLocalUpdate = await getLocalUpdate({
      recordId: update?.parentId ?? '',
      table: 'disclosures',
    });

    const _diffs = compareObjects(localDisclosureConsultationData || {}, onlineDisclosureConsultationData || {}, {});

    let _newConsultationAudio: string | Blob | null | undefined = null;

    let _consultationAudioToDelete = '';
    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }

        return acc;
      }, {} as TAddDisclosureAdviserConsultationPayload);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        _newConsultationAudio = dto.consultationAudio;
        if (_newConsultationAudio && typeof _newConsultationAudio === 'string') {
          const _opfsAudioFile = await readAudioFile(_newConsultationAudio);
          if (_opfsAudioFile) {
            dto.consultationAudio = _opfsAudioFile;
          }
        }
        if (parentDisclosureLocalUpdate) {
          dto.disclosureId = (parentDisclosureLocalUpdate.serverRecordId || dto.disclosureId || update.parentId!) ?? '';
        }

        await addDisclosureConsultation(dto).unwrap();
        if (_newConsultationAudio && typeof _newConsultationAudio === 'string') {
          _consultationAudioToDelete = _newConsultationAudio;
        }
        serverRecordId = dto.disclosureId;
      } else {
        if (dto.consultationAudio && typeof dto.consultationAudio === 'string') {
          const _opfsAudioFile = await readAudioFile(dto.consultationAudio);
          if (_opfsAudioFile) {
            _consultationAudioToDelete = dto.consultationAudio;
            dto.consultationAudio = _opfsAudioFile;
          }
        }

        await updateDisclosureConsultation({
          ...dto,
          id: update.recordId,
          disclosureId: update.parentId!,
        }).unwrap();
        serverRecordId = update.parentId!;
      }
      if (_consultationAudioToDelete) {
        await deleteAudioFile(_consultationAudioToDelete);
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
      // notifySuccess(STRINGS.action_done_successfully);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const handleSaveDisclosureSubPatientUpdate = async (update: TOfflineUpdate) => {
    const localDisclosureSubPatientData = await getLocalDisclosureSubPatient(update.recordId);

    const { data: onlineDisclosureSubPatientData } = await getOnlineDisclosureSubPatientData({ id: update.recordId });
    const _diffs = compareObjects(localDisclosureSubPatientData || {}, onlineDisclosureSubPatientData || {}, {});

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }

        return acc;
      }, {} as TAddSubPatientDto);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        const addedSubPatient = await addDisclosureSubPatient(dto).unwrap();
        serverRecordId = addedSubPatient.id;
      } else {
        await updateDisclosureSubPatient({ ...dto, id: update.recordId }).unwrap();
        serverRecordId = update.recordId;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
      // notifySuccess(STRINGS.action_done_successfully);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const [isBulkSaving, setIsBulkSaving] = useState(false);

  const handleBulkSave = useCallback(async (update: TOfflineUpdate) => {
    setIsBulkSaving(true);
    switch (update.table) {
      case 'patients':
        await handleSavePatientUpdate(update);
        break;

      case 'disclosures':
        await handleSaveDisclosureUpdate(update);
        break;

      case 'disclosure_properties':
        await handleSaveDisclosurePropertiesUpdate(update);
        break;

      case 'disclosure_consultations':
        await handleSaveDisclosureConsultationUpdate(update);
        break;

      case 'disclosure_sub_patients':
        await handleSaveDisclosureSubPatientUpdate(update);
        break;
      default: {
        console.error('UNHANDLED UPDATE', update);
        break;
      }
    }
    setIsBulkSaving(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBulkSaveClick = async () => {
    for await (const update of updates || []) {
      await handleBulkSave(update);
    }
    notifySuccess(STRINGS.action_done_successfully);
  };

  // useEffect(() => {
  //   if (isBulkSaving) return;
  //   if (currentUpdate) {
  //     handleBulkSave(currentUpdate);
  //   }
  // }, [currentUpdate, handleBulkSave, isBulkSaving]);

  return { handleBulkSaveClick, isBulkSaving };
};

export default useBulkOfflineUpdate;
