import type { TLocalDb } from '@/libs/kysely/schema';
import { AddCircleOutline, ChangeCircleOutlined, DeleteOutline, EditOutlined, Save } from '@mui/icons-material';
import { Button, Card, Grid, Paper, Stack, Typography } from '@mui/material';
import { lightGreen, orange, red, teal } from '@mui/material/colors';
import STRINGS from '@/core/constants/strings.constant';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useBeneficiaryLoader } from '@/features/beneficiaries/hooks/use-beneficiary-loader.hook';
import InfoItem from './info-item.component';
import { compareObjects, type FieldDiff } from '@/core/utils/conflict-diff.util';
import type {
  TAddBeneficiaryDto,
  TAddBeneficiaryMedicinePayload,
  TAddFamilyMemberPayload,
  TBeneficiaryPhone,
} from '@/features/beneficiaries/types/beneficiary.types';
// NOTE: TArea is not required after refactor
import { useDisclosureLoader } from '@/features/disclosures/hooks/disclosure-loader.hook';
// TAutocompleteItem is not referenced directly after normalization helpers
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import useLocalUpdateLoader from '../hooks/local-update-loader.hook';
import {
  formatDateTime,
  getErrorMessage,
  getStringsLabel,
  getVoiceSrc,
  isNullOrUndefined,
} from '@/core/helpers/helpers';
import { useBeneficiaryFamilyMemberLoader } from '@/features/beneficiaries/hooks/beneficiary-family-member-loader.hook';
import { useDisclosureDetailsLoader } from '@/features/disclosures/hooks/disclosure-details-loader.hook';
import { useDisclosureNoteLoader } from '@/features/disclosures/hooks/disclosure-note-loader.hook';
import { useBeneficiaryMedicineLoader } from '@/features/beneficiaries/hooks/beneficiary-medicine-loader.hook';
import beneficiaryApi from '@/features/beneficiaries/api/beneficiary.api';
import useLocalUpdatesTable from '../hooks/local-updates-table.hook';
import { notifyError } from '@/core/components/common/toast/toast';
import disclosuresApi from '@/features/disclosures/api/disclosures.api';
import type {
  TAddDisclosureDetailsDto,
  TAddDisclosureDto,
  TAddDisclosureNotePayload,
} from '@/features/disclosures/types/disclosure.types';
import { deleteAudioFile, readAudioFile } from '@/core/helpers/opfs-audio.helpers';
import { baseUrl } from '@/core/api/root.api';

type TOfflineUpdateComponent = (props: {
  id: string;
  // invalidateQueries: (id: string) => void
}) => ReactNode;

const RenderAudioFile = ({ field, isServerValue }: { field: FieldDiff; isServerValue?: boolean }) => {
  const [objectUrl, setObjectUrl] = useState('');

  useEffect(() => {
    (async () => {
      if (field.localValue && !isServerValue) {
        const audio = await readAudioFile(field.localValue);
        if (audio) {
          const url = URL.createObjectURL(audio);
          setObjectUrl(url);
        }
      }
      if (field.serverValue && isServerValue) {
        setObjectUrl(getVoiceSrc({ baseUrl, filePath: field.serverValue }));
      }
    })();
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.localValue, isServerValue]);

  if (!objectUrl) return STRINGS.none;

  return <audio controlsList="nodownload" controls src={objectUrl} style={{ width: '100%' }} />;
};

const ActionButtons = ({ onSave, disabled }: { disabled?: boolean; onSave?: () => void }) => {
  return (
    <Stack direction="row" gap={1}>
      <Button onClick={onSave} disabled={disabled} startIcon={<Save />} fullWidth>
        {STRINGS.save}
      </Button>
      <Button disabled={disabled} startIcon={<DeleteOutline />} variant="outlined" color="error">
        {STRINGS.cancel}
      </Button>
    </Stack>
  );
};

const OperationLabel = ({ operation }: { operation: TLocalDb['updates']['operation'] }) => {
  const isInsert = operation === 'INSERT';
  return (
    <Stack direction="row" gap={1} alignItems="center" sx={{ color: isInsert ? teal[800] : orange[800] }}>
      <ChangeCircleOutlined />
      <Typography variant="h6">{isInsert ? STRINGS.added_values : STRINGS.changed_values}</Typography>
    </Stack>
  );
};

const OfflineUpdateHeader = ({ operation, title }: Pick<TLocalDb['updates'], 'operation'> & { title: string }) => {
  const isInsert = operation === 'INSERT';

  const borderColor = isInsert ? teal[800] : orange[800];

  const bgColor = isInsert ? teal[50] : orange[50];

  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ p: 1.5, bgcolor: bgColor }}>
      <Stack direction="row" alignItems="center" gap={1}>
        {isInsert ? <AddCircleOutline sx={{ color: borderColor }} /> : <EditOutlined sx={{ color: borderColor }} />}
        <Typography variant="h6" sx={{ color: borderColor }}>
          {isInsert ? STRINGS.insert_operation : STRINGS.update_operation} {title}
          {/* {update.table === 'disclosures' && STRINGS.disclosure} */}
          {/* {update.table === 'patients' && STRINGS.patient} */}
        </Typography>
        {/* {isBlocked && ( */}
        {/*   <Chip */}
        {/*     icon={<BlockOutlined />} */}
        {/*     label={STRINGS.sync_insert_first} */}
        {/*     size="small" */}
        {/*     color="warning" */}
        {/*     sx={{ fontWeight: 'medium' }} */}
        {/*   /> */}
        {/* )} */}
      </Stack>
      {/* <StatusChip status={update.status} /> */}
    </Stack>
  );
};

const applyFieldTransform = (result: FieldDiff[], field: string, fn: (val: any) => any) => {
  const diff = result.find((d) => d.field === field);
  if (!diff) return;
  if (diff.localValue) diff.localValue = fn(diff.localValue);
  if (diff.serverValue) diff.serverValue = fn(diff.serverValue);
};

const applyNameTransform = (result: FieldDiff[], field: string) =>
  applyFieldTransform(result, field, (v) => (v as any)?.name ?? v);

const applyLocalization = (result: FieldDiff[], field: string) =>
  applyFieldTransform(result, field, (v) => STRINGS[v as keyof typeof STRINGS] ?? v);

// helpers used by components below (kept exported for potential reuse)
const applyGetStringsLabel = (result: FieldDiff[], field: string, key: string) =>
  applyFieldTransform(result, field, (v) => getStringsLabel({ key, val: v }));

const applyFormatDate = (result: FieldDiff[], field: string, opts?: Intl.DateTimeFormatOptions) =>
  applyFieldTransform(result, field, (v) => formatDateTime(v, false, opts ?? { year: 'numeric' }));

const normalizePhones = (result: FieldDiff[], field = 'phones') => {
  const diff = result.find((d) => d.field === field);
  if (!diff) return;
  if (diff.localValue && Array.isArray(diff.localValue))
    diff.localValue = diff.localValue.map((p: TBeneficiaryPhone) => p.phone).join(', ');
  if (diff.serverValue && Array.isArray(diff.serverValue))
    diff.serverValue = diff.serverValue.map((p: TBeneficiaryPhone) => p.phone).join(', ');
};

const removeKeys = (result: FieldDiff[], keys: string[]) => result.filter((d) => !keys.includes(d.field));

const removeNoLocalAndServerValues = (result: FieldDiff[]) => result.filter((d) => !(!d.localValue && !d.serverValue));
const DiffColumns = ({
  diffs,
  grid,
  order,
  showDiff = false,
  customRenderer,
}: {
  diffs: FieldDiff[];
  grid?: Record<string, number>;
  order?: Record<string, number>;
  showDiff?: boolean;
  customRenderer?: Record<string, (payload: { field: FieldDiff; isServerValue?: boolean }) => ReactNode>;
}) => {
  const sorted = useMemo(() => {
    let _sorted = diffs.slice();
    if (order) {
      _sorted = _sorted.sort((a, b) => (order[a.field] || 0) - (order[b.field] || 0));
    }
    /*   if (grid) {
      _sorted = _sorted.sort((a, b) => (grid[a.field] ?? 12) - (grid[b.field] ?? 12));
    } */
    return _sorted;
  }, [diffs, order]);

  return (
    <Grid container columnSpacing={1} rowSpacing={1.5}>
      {sorted.map((d) => {
        const Renderer = customRenderer?.[d.field];

        if (showDiff) {
          return (
            <Grid key={d.field} container size={12}>
              <Grid key={`${d.field}-server-value`} size={grid?.[d.field] ?? 12}>
                <Paper elevation={0} sx={{ p: 0, background: red[50], py: 0.5 }}>
                  <InfoItem
                    icon={null}
                    label={d.displayName}
                    value={Renderer ? <Renderer field={d} isServerValue /> : d.serverValue || STRINGS.none}
                  />
                </Paper>
              </Grid>
              <Grid key={`${d.field}-local-value`} size={grid?.[d.field] ?? 12} sx={{}}>
                <Paper elevation={0} sx={{ background: lightGreen[50], py: 0.5 }}>
                  <InfoItem
                    icon={null}
                    label={d.displayName}
                    value={Renderer ? <Renderer field={d} /> : d.localValue || STRINGS.none}
                  />
                </Paper>
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid size={grid?.[d.field] ?? 12} key={d.field}>
            <Paper elevation={0} sx={{ background: lightGreen[50], py: 0.5 }}>
              <InfoItem
                icon={null}
                label={d.displayName}
                value={Renderer ? <Renderer field={d} /> : d.localValue || STRINGS.none}
              />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

const PatientOfflineUpdate: TOfflineUpdateComponent = ({ id }) => {
  const { data: update } = useLocalUpdateLoader({ id });

  const { data: localBeneficiaryData, isFetching: isFetchingOfflineBeneficiaryData } = useBeneficiaryLoader(
    { id: update?.recordId ?? '' },
    true
  );
  const { data: onlineBeneficiaryData, isFetching: isFetchingOnlineBeneficiaryData } = useBeneficiaryLoader({
    id: update?.recordId ?? '',
  });

  const localUpdateTable = useLocalUpdatesTable();
  const [addBeneficiary, { isLoading: isAddingBeneficiary }] = beneficiaryApi.useAddBeneficiaryMutation();
  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] = beneficiaryApi.useUpdateBeneficiaryMutation();

  const diffs = useMemo(() => {
    if (!localBeneficiaryData) return null;
    let result = compareObjects(localBeneficiaryData, onlineBeneficiaryData || {}, {
      about: STRINGS.patient_about,
      job: STRINGS.job_or_school,
      nationalNumber: STRINGS.national_number,
      phones: STRINGS.phone_numbers,
      address: STRINGS.patient_address,
      area: STRINGS.area,
      birthDate: STRINGS.birth_date,
      gender: STRINGS.gender,
    }).filter((f) => f.hasConflict);

    normalizePhones(result);
    applyNameTransform(result, 'area');
    applyLocalization(result, 'gender');
    result = removeKeys(result, ['areaId', 'name']);

    return result;
  }, [localBeneficiaryData, onlineBeneficiaryData]);

  if (!localBeneficiaryData || !update) return null;

  const isLoading =
    isFetchingOnlineBeneficiaryData || isFetchingOfflineBeneficiaryData || isAddingBeneficiary || isUpdatingBeneficiary;

  const handleSave = async () => {
    const _diffs = compareObjects(localBeneficiaryData, onlineBeneficiaryData || {}, {});

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          if (curr.field === 'phones') {
            acc['phoneNumbers'] = (curr.localValue as TBeneficiaryPhone[]).map((p) => p.phone);
          }
        }

        return acc;
      }, {} as TAddBeneficiaryDto);

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

  return (
    <Card sx={{ p: 1, height: '100%', position: 'relative' }}>
      <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
        <OfflineUpdateHeader
          operation={update?.operation}
          title={`${STRINGS.the_patient} ${localBeneficiaryData.name}`}
        />

        {!!diffs?.length && (
          <Stack gap={1} sx={{ flex: 1, overflow: 'auto' }}>
            <OperationLabel operation={update.operation} />
            <DiffColumns
              showDiff={update.operation === 'UPDATE'}
              diffs={diffs}
              grid={{ gender: 6, nationalNumber: 6, area: 6, address: 12, birthDate: 6, job: 12 }}
              order={{ nationalNumber: 1, birthDate: 2, gender: 3, area: 4, address: 5, job: 6, phones: 7, about: 8 }}
            />
          </Stack>
        )}
        {isLoading && <LoadingOverlay />}
        {/* {!update?.serverRecordId && <div>needs server id</div>} */}
        <ActionButtons onSave={handleSave} disabled={isLoading} />
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

const DisclosureOfflineUpdate: TOfflineUpdateComponent = ({ id }) => {
  const { data: update } = useLocalUpdateLoader({ id });
  const { data: localDisclosureData, isFetching: isFetchingOnlineDisclosureData } = useDisclosureLoader(
    { id: update?.recordId ?? '' },
    true
  );

  const { data: onlineDisclosureData, isFetching: isFetchingOfflineDisclosureData } = useDisclosureLoader({
    id: update?.recordId ?? '',
  });

  const { data: disclosureBeneficiaryUpdate, isFetching: isFetchingParentUpdateData } = useLocalUpdateLoader({
    recordId: localDisclosureData?.patientId ?? '',
  });

  const localUpdateTable = useLocalUpdatesTable();
  const [addDisclosure, { isLoading: isAddingDisclosure }] = disclosuresApi.useAddDisclosureMutation();
  const [updateDisclosure, { isLoading: isUpdatingDisclosure }] = disclosuresApi.useUpdateDisclosureMutation();

  const blocked = !isNullOrUndefined(disclosureBeneficiaryUpdate) && !disclosureBeneficiaryUpdate.serverRecordId;

  const diffs = useMemo(() => {
    if (!localDisclosureData) return null;
    let result = compareObjects(localDisclosureData, onlineDisclosureData || {}, {
      appointmentDate: STRINGS.appointment_date,
      archiveNumber: STRINGS.archive_number,
      nationalNumber: STRINGS.national_number,
      customRating: STRINGS.custom_rating,
      initialNote: STRINGS.initial_note,
      isAppointmentCompleted: STRINGS.disclosure_appointment_status,
      isCustomRating: STRINGS.is_custom_rating,
      isReceived: STRINGS.disclosure_is_received_status,
      patient: STRINGS.the_patient,
      priority: STRINGS.priority,
      rating: STRINGS.rating,
      ratingNote: STRINGS.rating_note,
      scout: STRINGS.the_scout,
      status: STRINGS.status,
      type: STRINGS.type,
      visitResult: STRINGS.visit_result,
      visitReason: STRINGS.visit_reason,
      visitNote: STRINGS.visit_note,
    }).filter((v) => v.hasConflict);

    // object fields are autocomplete items
    applyNameTransform(result, 'scout');
    applyNameTransform(result, 'priority');
    applyNameTransform(result, 'rating');

    applyLocalization(result, 'status');
    applyLocalization(result, 'type');
    applyLocalization(result, 'visitResult');

    result = removeKeys(result, ['patientId', 'priorityId', 'ratingId', 'scoutId', 'patient']);

    if (!onlineDisclosureData) {
      result = removeNoLocalAndServerValues(result);
    }

    return result;
  }, [localDisclosureData, onlineDisclosureData]);

  if (!localDisclosureData || !update) return null;

  const handleSave = async () => {
    const _diffs = compareObjects(localDisclosureData, onlineDisclosureData || {}, {});

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
        if (disclosureBeneficiaryUpdate) {
          dto.patientId = disclosureBeneficiaryUpdate.serverRecordId ?? dto.patientId;
        }
        const addedBeneficiary = await addDisclosure(dto).unwrap();
        serverRecordId = addedBeneficiary.id;
      } else {
        await updateDisclosure({ ...dto, id: update.recordId }).unwrap();
        serverRecordId = update.recordId;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const isLoading =
    isAddingDisclosure ||
    isUpdatingDisclosure ||
    isFetchingOfflineDisclosureData ||
    isFetchingOnlineDisclosureData ||
    isFetchingParentUpdateData;
  console.log({
    isAddingDisclosure,
    isUpdatingDisclosure,
    isFetchingOnlineDisclosureData,
    isFetchingOfflineDisclosureData,
    isFetchingParentUpdateData,
  });

  return (
    <Card sx={{ p: 1, height: '100%', position: 'relative' }}>
      <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
        <OfflineUpdateHeader
          operation={update.operation}
          title={`${STRINGS.disclosure} ${STRINGS.the_patient} ${localDisclosureData.patient.name}`}
        />
        {!!diffs?.length && (
          <Stack gap={1} sx={{ flex: 1, overflow: 'auto' }}>
            <OperationLabel operation={update.operation} />
            <DiffColumns
              showDiff={update.operation === 'UPDATE'}
              diffs={diffs}
              grid={{
                appointmentDate: 6,
                archiveNumber: 6,
                customRating: 12,
                initialNote: 12,
                isAppointmentCompleted: 6,
                isCustomRating: 6,
                isReceived: 6,
                patient: 6,
                priority: 6,
                rating: 6,
                ratingNote: 12,
                scout: 6,
                status: 6,
                type: 6,
                visitResult: 12,
                visitReason: 12,
                visitNote: 12,
              }}
              order={{
                patient: 1,
                status: 2,
                type: 3,
                priority: 4,
                scout: 5,
                initialNote: 6,
                visitResult: 7,
                visitReason: 8,
                visitNote: 9,
                rating: 10,
                isCustomRating: 11,
                customRating: 12,
                ratingNote: 13,
                appointmentDate: 14,
                isAppointmentCompleted: 15,
                isReceived: 16,
                archiveNumber: 17,
              }}
            />
          </Stack>
        )}

        {/* {!update?.serverRecordId && <div>needs server id</div>} */}
        <ActionButtons onSave={handleSave} disabled={isLoading || blocked} />
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

const FamilyMemberOfflineUpdate = ({ id }: { id: string }) => {
  const { data: update } = useLocalUpdateLoader({ id });
  const { data: localFamilyMemberData, isFetching: isFetchingLocalFamilyMemberData } = useBeneficiaryFamilyMemberLoader(
    update?.recordId ?? '',
    true
  );
  const { data: onlineFamilyMemberData, isFetching: isFetchingOnlineBeneficiaryData } =
    useBeneficiaryFamilyMemberLoader(update?.recordId ?? '');

  const localUpdateTable = useLocalUpdatesTable();
  const [addFamilyMember, { isLoading: isAddingFamilyMember }] = beneficiaryApi.useAddFamilyMemberMutation();
  const [updateFamilyMember, { isLoading: isUpdatingFamilyMember }] = beneficiaryApi.useUpdateFamilyMemberMutation();

  const { data: localFamilyMemberPatientData } = useBeneficiaryLoader({ id: update?.parentId ?? '' }, true);

  const { data: parentBeneficiaryUpdateData, isFetching: isFetchingParentUpdateData } = useLocalUpdateLoader({
    recordId: update?.parentId ?? '',
  });

  const blocked =
    update?.operation === 'INSERT' &&
    !isNullOrUndefined(parentBeneficiaryUpdateData) &&
    !parentBeneficiaryUpdateData.serverRecordId;

  const diffs = useMemo(() => {
    if (!localFamilyMemberData) return null;
    let result = compareObjects(localFamilyMemberData, onlineFamilyMemberData || {}, {
      note: STRINGS.note,
      jobOrSchool: STRINGS.job_or_school,
      nationalNumber: STRINGS.national_number,
      residential: STRINGS.residential,
      kinshep: STRINGS.kinship,
      birthDate: STRINGS.birth_date,
      gender: STRINGS.gender,
      kidsCount: STRINGS.kids_count,
      name: STRINGS.name,
    }).filter((v) => v.hasConflict);

    result = removeKeys(result, ['patientId']);

    applyLocalization(result, 'gender');
    applyGetStringsLabel(result, 'kinshep', 'kinship');
    applyFormatDate(result, 'birthDate', { year: 'numeric' });

    return result;
  }, [localFamilyMemberData, onlineFamilyMemberData]);

  useEffect(() => {
    if (!onlineFamilyMemberData && !!localFamilyMemberData && !update?.serverRecordId) {
      console.warn('NEEDS SERVER ID');
    }
  }, [localFamilyMemberData, onlineFamilyMemberData, update?.serverRecordId]);

  // useEffect(() => {
  //   localUpdatesTable.updateById(update?.id ?? '', { serverRecordId: '' });
  // }, []);

  const isLoading =
    isFetchingOnlineBeneficiaryData ||
    isAddingFamilyMember ||
    isUpdatingFamilyMember ||
    isFetchingLocalFamilyMemberData ||
    isFetchingParentUpdateData;

  if (!localFamilyMemberData || !update) return null;

  const handleSave = async () => {
    const _diffs = compareObjects(localFamilyMemberData, onlineFamilyMemberData || {}, {});

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }
        console.log({ _diffs });

        return acc;
      }, {} as TAddFamilyMemberPayload);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        if (parentBeneficiaryUpdateData) {
          dto.patientId = (parentBeneficiaryUpdateData.serverRecordId || dto.patientId || update.parentId!) ?? '';
        }

        const addedFamilyMember = await addFamilyMember(dto).unwrap();
        serverRecordId = addedFamilyMember.id;
      } else {
        await updateFamilyMember({
          ...dto,
          id: update.recordId,
          patientId: onlineFamilyMemberData?.patientId ?? '',
        }).unwrap();
        serverRecordId = update.recordId!;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <Card sx={{ p: 1, height: '100%', position: 'relative' }}>
      <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
        <OfflineUpdateHeader
          operation={update?.operation}
          title={`${STRINGS.family_member} ${STRINGS.the_patient} ${localFamilyMemberPatientData?.name}`}
        />

        {!!diffs?.length && (
          <Stack gap={1} sx={{ flex: 1, overflow: 'auto' }}>
            <OperationLabel operation={update.operation} />
            <DiffColumns
              showDiff={update.operation === 'UPDATE'}
              diffs={diffs}
              grid={{
                name: 6,
                gender: 6,
                nationalNumber: 6,
                area: 6,
                address: 6,
                birthDate: 6,
                kidsCount: 6,
                kinshep: 6,
              }}
              order={{
                name: 1,
                kinshep: 2,
                nationalNumber: 3,
                gender: 4,
                birthDate: 5,
                kidsCount: 6,
                job: 7,
                phones: 8,
                about: 9,
                jobOrSchool: 10,
                residential: 11,
                note: 12,
              }}
            />
          </Stack>
        )}
        {/* {!update?.serverRecordId && <div>needs server id</div>} */}
        <ActionButtons onSave={handleSave} disabled={isLoading || blocked} />
      </Stack>

      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

const DisclosureDetialsOfflineUpdate: TOfflineUpdateComponent = ({ id }) => {
  const { data: update } = useLocalUpdateLoader({ id });

  const { data: localDisclosureDetailsData, isFetching: isFetchingLocalDisclosureDetails } = useDisclosureDetailsLoader(
    update?.parentId ?? '',
    true
  );
  const { data: onlineDisclosureDetailsData, isFetching: isFetchingOnlineDisclosureDetails } =
    useDisclosureDetailsLoader(update?.parentId ?? '');
  const { data: localDisclosureData } = useDisclosureLoader({ id: update?.parentId ?? '' }, true);

  const localUpdateTable = useLocalUpdatesTable();
  const [addDisclosureDetails, { isLoading: isAddingDisclosureDetails }] =
    disclosuresApi.useAddDisclosureDetailsMutation();

  const [updateDisclosureDetails, { isLoading: isUpdatingDisclosureDetails }] =
    disclosuresApi.useUpdateDisclosureDetailsMutation();

  const { data: parentDisclosureData, isFetching: isFetchingParentUpdateData } = useLocalUpdateLoader({
    recordId: update?.parentId ?? '',
  });

  const blocked =
    !isNullOrUndefined(parentDisclosureData) &&
    parentDisclosureData.table === 'disclosures' &&
    !parentDisclosureData.serverRecordId;

  const diffs = useMemo(() => {
    if (!localDisclosureDetailsData) return null;
    let result = compareObjects(localDisclosureDetailsData, onlineDisclosureDetailsData || {}, {
      diseasesOrSurgeries: STRINGS.diseases_or_surgeries,
      jobOrSchool: STRINGS.job_or_school,
      houseOwnership: STRINGS.house_ownership,
      houseOwnershipNote: STRINGS.house_ownership_note,
      electricity: STRINGS.electricity,
      expenses: STRINGS.expenses,
      houseCondition: STRINGS.home_condition,
      houseConditionStatus: STRINGS.home_condition_status,
      houseConditionNote: STRINGS.home_condition_status_note,
      pros: STRINGS.pons,
      cons: STRINGS.cons,
      other: STRINGS.other_details,
    }).filter((v) => v.hasConflict);

    result = removeKeys(result, ['disclosureId']);

    applyLocalization(result, 'gender');

    applyGetStringsLabel(result, 'houseCondition', 'house_condition');
    applyGetStringsLabel(result, 'houseOwnership', 'house_ownership');

    return result;
  }, [localDisclosureDetailsData, onlineDisclosureDetailsData]);

  useEffect(() => {
    if (!onlineDisclosureDetailsData && !!localDisclosureDetailsData && !update?.serverRecordId) {
      console.warn('NEEDS SERVER ID');
    }
  }, [localDisclosureDetailsData, onlineDisclosureDetailsData, update?.serverRecordId]);

  // useEffect(() => {
  //   localUpdatesTable.updateById(update?.id ?? '', { serverRecordId: '' });
  // }, []);

  if (!localDisclosureDetailsData || !update) return null;

  const handleSave = async () => {
    const _diffs = compareObjects(localDisclosureDetailsData, onlineDisclosureDetailsData || {}, {});

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }

        return acc;
      }, {} as TAddDisclosureDetailsDto);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        if (parentDisclosureData) {
          dto.disclosureId = (parentDisclosureData.serverRecordId || dto.disclosureId || update.parentId!) ?? '';
        }
        await addDisclosureDetails(dto).unwrap();
        serverRecordId = dto.disclosureId;
      } else {
        await updateDisclosureDetails(dto).unwrap();
        serverRecordId = update.parentId!;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const isLoading =
    isFetchingOnlineDisclosureDetails ||
    isFetchingLocalDisclosureDetails ||
    isAddingDisclosureDetails ||
    isUpdatingDisclosureDetails ||
    isFetchingParentUpdateData;

  return (
    <Card sx={{ p: 1, height: '100%', position: 'relative' }}>
      <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
        <OfflineUpdateHeader
          operation={update?.operation}
          title={`${STRINGS.disclosures_details} ${STRINGS.the_patient} ${localDisclosureData?.patient.name} `}
        />

        {!!diffs?.length && (
          <Stack gap={1} sx={{ flex: 1, overflow: 'auto' }}>
            <OperationLabel operation={update.operation} />
            <DiffColumns
              diffs={diffs}
              order={{
                diseasesOrSurgeries: 1,
                jobOrSchool: 2,
                houseOwnership: 3,
                houseOwnershipNote: 4,
                electricity: 5,
                expenses: 6,
                houseCondition: 7,
                houseConditionStatus: 8,
                houseConditionNote: 9,
                pros: 10,
                cons: 11,
                other: 12,
              }}
            />
          </Stack>
        )}
        {/* {!update?.serverRecordId && <div>needs server id</div>} */}
        {/* {blocked && <div>MUST SYNC PATIENT FIRST</div>} */}
        <ActionButtons onSave={handleSave} disabled={isLoading || blocked} />
      </Stack>

      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

const DisclosureNoteOfflineUpdate = ({ id }: { id: string }) => {
  const { data: update } = useLocalUpdateLoader({ id });

  const { data: localDisclosureNoteData, isFetching: isFetchingLocalDisclosureNote } = useDisclosureNoteLoader(
    update?.recordId,
    true
  );

  const { data: onlineDisclosureNoteData, isFetching: isFetchingOnlineBeneficiaryData } = useDisclosureNoteLoader(
    update?.recordId ?? ''
  );
  const { data: localDisclosureData } = useDisclosureLoader({ id: update?.parentId ?? '' }, true);

  const localUpdateTable = useLocalUpdatesTable();

  const [addDisclosureNote, { isLoading: isAddingDisclosureNote }] = disclosuresApi.useAddDisclosureNoteMutation();

  const [updateDisclosureNote, { isLoading: isUpdatingDisclosureNote }] =
    disclosuresApi.useUpdateDisclosureNoteMutation();

  const { data: parentDisclosureData, isFetching: isFetchingParentUpdateData } = useLocalUpdateLoader({
    recordId: update?.parentId ?? '',
  });

  const blocked =
    !isNullOrUndefined(parentDisclosureData) &&
    parentDisclosureData.table === 'disclosures' &&
    !parentDisclosureData.serverRecordId;

  const diffs = useMemo(() => {
    if (!localDisclosureNoteData) return null;

    let result = compareObjects(localDisclosureNoteData, onlineDisclosureNoteData || {}, {
      noteAudio: STRINGS.recorded_audio,
      noteText: STRINGS.note,
    }).filter((v) => v.hasConflict);

    result = removeKeys(result, ['disclosureId']);

    return result;
  }, [localDisclosureNoteData, onlineDisclosureNoteData]);

  const isLoading =
    isFetchingOnlineBeneficiaryData ||
    isFetchingLocalDisclosureNote ||
    isAddingDisclosureNote ||
    isUpdatingDisclosureNote ||
    isFetchingParentUpdateData;

  if (!localDisclosureNoteData || !update) return null;

  const handleSave = async () => {
    const _diffs = compareObjects(localDisclosureNoteData, onlineDisclosureNoteData || {}, {});

    let _newNoteAudio: string | Blob | null | undefined = null;

    let _noteAudioToDelete = '';
    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }

        return acc;
      }, {} as TAddDisclosureNotePayload);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        _newNoteAudio = dto.noteAudio;
        if (_newNoteAudio && typeof _newNoteAudio === 'string') {
          const _opfsAudioFile = await readAudioFile(_newNoteAudio);
          if (_opfsAudioFile) {
            dto.noteAudio = _opfsAudioFile;
          }
        }
        if (parentDisclosureData) {
          dto.disclosureId = (parentDisclosureData.serverRecordId || dto.disclosureId || update.parentId!) ?? '';
        }

        await addDisclosureNote(dto).unwrap();
        if (_newNoteAudio && typeof _newNoteAudio === 'string') {
          _noteAudioToDelete = _newNoteAudio;
        }
        serverRecordId = dto.disclosureId;
      } else {
        if (dto.noteAudio && typeof dto.noteAudio === 'string') {
          const _opfsAudioFile = await readAudioFile(dto.noteAudio);
          if (_opfsAudioFile) {
            _noteAudioToDelete = dto.noteAudio;
            dto.noteAudio = _opfsAudioFile;
          }
        }

        await updateDisclosureNote({
          ...dto,
          id: update.recordId,
          disclosureId: update.parentId!,
        }).unwrap();
        serverRecordId = update.parentId!;
      }
      if (_noteAudioToDelete) {
        await deleteAudioFile(_noteAudioToDelete);
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <Card sx={{ p: 1, height: '100%', position: 'relative' }}>
      <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
        <OfflineUpdateHeader
          operation={update?.operation}
          title={`${STRINGS.note} ${STRINGS.the_patient} ${localDisclosureData?.patient.name} `}
        />

        {!!diffs?.length && (
          <Stack gap={1} sx={{ flex: 1, overflow: 'auto' }}>
            <OperationLabel operation={update.operation} />{' '}
            <DiffColumns
              showDiff={update.operation === 'UPDATE'}
              diffs={diffs}
              order={{
                diseasesOrSurgeries: 1,
                jobOrSchool: 2,
                houseOwnership: 3,
                houseOwnershipNote: 4,
                electricity: 5,
                expenses: 6,
                houseCondition: 7,
                houseConditionStatus: 8,
                houseConditionNote: 9,
                pros: 10,
                cons: 11,
                other: 12,
              }}
              customRenderer={{
                noteAudio: RenderAudioFile,
              }}
            />
          </Stack>
        )}
        {/* {!update?.serverRecordId && <div>needs server id</div>} */}
        <ActionButtons onSave={handleSave} disabled={isLoading || blocked} />
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

const BeneficiaryMedicineOfflineUpdate = ({ id }: { id: string }) => {
  const { data: update } = useLocalUpdateLoader({ id });

  const { data: localBeneficiaryMedicineData, isFetching: isFetchingLocalBeneficiaryMedicine } =
    useBeneficiaryMedicineLoader(update?.recordId, true);

  const { data: onlineBeneficiaryMedicineData, isFetching: isFetchingOnlineBeneficiaryData } =
    useBeneficiaryMedicineLoader(update?.recordId ?? '');

  const localUpdateTable = useLocalUpdatesTable();
  const [addBeneficiaryMedicine, { isLoading: isAddingBeneficirayMedicine }] =
    beneficiaryApi.useAddBeneficiaryMedicineMutation();
  const [updateBeneficiaryMedicine, { isLoading: isUpdatingBeneficiaryMedicine }] =
    beneficiaryApi.useUpdateBeneficiaryMedicineMutation();

  const { data: localMedicineBeneficiaryData } = useBeneficiaryLoader({ id: update?.parentId ?? '' }, true);

  const { data: parentBeneficiaryUpdateData, isFetching: isFetchingParentUpdateData } = useLocalUpdateLoader({
    recordId: update?.parentId ?? '',
  });

  const blocked =
    update?.operation === 'INSERT' &&
    !isNullOrUndefined(parentBeneficiaryUpdateData) &&
    !parentBeneficiaryUpdateData.serverRecordId;

  const isLoading =
    isFetchingOnlineBeneficiaryData ||
    isFetchingLocalBeneficiaryMedicine ||
    isAddingBeneficirayMedicine ||
    isUpdatingBeneficiaryMedicine ||
    isFetchingParentUpdateData;

  const diffs = useMemo(() => {
    if (!localBeneficiaryMedicineData) return null;
    let result = compareObjects(localBeneficiaryMedicineData, onlineBeneficiaryMedicineData || {}, {
      medicine: STRINGS.the_medicine,
      intakeFrequency: STRINGS.intake_frequency,
      dosePerIntake: STRINGS.dose_per_intake,
      note: STRINGS.note,
    }).filter((v) => v.hasConflict);

    result = removeKeys(result, ['patientId', 'medicineId']);

    applyNameTransform(result, 'medicine');

    return result;
  }, [localBeneficiaryMedicineData, onlineBeneficiaryMedicineData]);

  if (!localBeneficiaryMedicineData || !update) return null;

  const handleSave = async () => {
    const _diffs = compareObjects(localBeneficiaryMedicineData, onlineBeneficiaryMedicineData || {}, {});

    const dto = _diffs
      .filter((d) => d.hasConflict)
      .reduce((acc, curr) => {
        if (curr.field in update.payload) {
          acc[curr.field as keyof typeof acc] = update.payload[curr.field as keyof typeof update.payload];
        } else {
          console.warn(curr.field, curr.localValue);
        }

        return acc;
      }, {} as TAddBeneficiaryMedicinePayload);

    try {
      let serverRecordId = '';
      if (update.operation === 'INSERT') {
        if (parentBeneficiaryUpdateData) {
          dto.patientId = (parentBeneficiaryUpdateData.serverRecordId || dto.patientId || update.parentId!) ?? '';
        }

        const addedFamilyMember = await addBeneficiaryMedicine(dto).unwrap();
        serverRecordId = addedFamilyMember.id;
      } else {
        await updateBeneficiaryMedicine({
          ...dto,
          id: update.recordId,
          medicineId: (update?.payload as any).medicineId ?? '',
          patientId: onlineBeneficiaryMedicineData?.patientId ?? '',
        }).unwrap();
        serverRecordId = update.recordId!;
      }
      await localUpdateTable.updateById(update.id, { serverRecordId, status: 'success' });
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <Card sx={{ p: 1, height: '100%', position: 'relative' }}>
      <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
        <OfflineUpdateHeader
          operation={update?.operation}
          title={`${STRINGS.medicine} ${STRINGS.the_patient} ${localMedicineBeneficiaryData?.name} `}
        />
        {!!diffs?.length && (
          <Stack gap={1} sx={{ flex: 1, overflow: 'auto' }}>
            <OperationLabel operation={update.operation} />
            <DiffColumns
              showDiff={update.operation === 'UPDATE'}
              diffs={diffs}
              grid={{
                intakeFrequency: 6,
                dosePerIntake: 6,
              }}
              order={{
                medicine: 1,
                intakeFrequency: 2,
                dosePerIntake: 3,
                note: 4,
              }}
            />
          </Stack>
        )}
        {/* {!update?.serverRecordId && <div>needs server id</div>} */}
        <ActionButtons onSave={handleSave} disabled={isLoading || blocked} />
      </Stack>

      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

const OfflineUpdate = ({ update }: { update: TLocalDb['updates'] }) => {
  const content = useMemo(() => {
    switch (update.table) {
      case 'patients': {
        return <PatientOfflineUpdate id={update.id} />;
      }
      case 'disclosures': {
        return <DisclosureOfflineUpdate id={update.id} />;
      }
      case 'family_members': {
        return <FamilyMemberOfflineUpdate id={update.id} />;
      }

      case 'disclosure_details': {
        return <DisclosureDetialsOfflineUpdate id={update.id} />;
      }

      case 'disclosure_notes': {
        return <DisclosureNoteOfflineUpdate id={update.id} />;
      }

      case 'patient_medicines': {
        return <BeneficiaryMedicineOfflineUpdate id={update.id} />;
      }

      default: {
        return <div>unsupported offline update {update.table}</div>;
      }
    }
  }, [update.id, update.table]);

  return (
    <Stack gap={1} sx={{ position: 'relative', height: '100%' }}>
      <Stack sx={{ height: '100%', overflow: 'auto' }}>{content}</Stack>
    </Stack>
  );
};

export default OfflineUpdate;
