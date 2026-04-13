import { Stack, Button, Card, Typography, Chip, Box, Collapse, Divider } from '@mui/material';
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import BeneficiaryCommonCard from '@/shared/components/beneficiary-common-card';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import { formatDateTime, isNullOrUndefined } from '@/core/helpers/helpers';
import type { TDisclosure } from '../types/disclosure.types';
import {
  Comment,
  DirectionsWalk,
  Edit,
  EventAvailable,
  History,
  Info,
  InfoOutline,
  Archive,
  People,
  ExpandMore,
  PersonAdd,
} from '@mui/icons-material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Link } from 'react-router-dom';
import { useMemo, useCallback, useState } from 'react';
import { getDisclosureLateDaysCount } from '../helpers/disclosure.helpers';
import usePermissions from '@/core/hooks/use-permissions.hook';
import InlineEditWrapper from '@/core/components/common/inline-edit-wrapper/inline-edit-wrapper.component';
import useDisclosureFieldMutation from '../hooks/use-disclosure-field-mutation.hook';
import { disclosureFieldSchemas } from '../validation/disclosure-fields.validation';
import { useEmployeesAutocompleteLoader } from '@/features/autocomplete/hooks/employees-autocomplete-loader.hook';
import { usePriorityDegreesLoader } from '@/features/priority-degres/hooks/priority-degrees-loader.hook';
import { EmployeeRole } from '@/features/employees/types/employee.types';
import type { TAutocompleteItem } from '@/core/types/common.types';
import type { TPriorityDegree } from '@/features/priority-degres/types/priority-degree.types';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import disclosuresApi from '../api/disclosures.api';
import { DisclosureStatus } from '../types/disclosure.types';
import { useDisclosureSubPatientsLoader } from '../hooks/disclosure-sub-patients-loader.hook';
import DisclosureSubPatientCard from './disclosure-sub-patient-card.component';
import { useNavigate } from 'react-router-dom';

const DisclosureHeaderCard = ({ disclosure }: { disclosure: TDisclosure }) => {
  const { isLate, lateDaysCount } = useMemo(() => getDisclosureLateDaysCount(disclosure), [disclosure]);
  const { currentCanEditDisclosure } = usePermissions();
  const isArchived = disclosure.status === 'archived';
  const [enableDisclosureMutation, { isLoading: isEnablingDisclosure }] = disclosuresApi.useUpdateDisclosureMutation();
  const canEnableDisclosure = disclosure.status === DisclosureStatus.suspended;
  const navigate = useNavigate();

  const [showSubPatients, setShowSubPatients] = useState(false);
  const { data: subPatients } = useDisclosureSubPatientsLoader(disclosure.id);

  const updateDisclosureField = useDisclosureFieldMutation(disclosure.id);

  const { data: { items: scouts = [] } = { items: [] } } = useEmployeesAutocompleteLoader({
    role: [EmployeeRole.manager, EmployeeRole.supervisor, EmployeeRole.scout],
    query: '',
  });

  const { data: priorities = [] } = usePriorityDegreesLoader({});

  const scoutOptions = useMemo(() => scouts.map((scout) => ({ id: scout.id, name: scout.name })), [scouts]);

  const handleScoutUpdate = useCallback(
    async (fieldKey: string, value: TAutocompleteItem | null) => {
      await updateDisclosureField(fieldKey as any, value?.id ?? null);
    },
    [updateDisclosureField]
  );

  const handlePriorityUpdate = useCallback(
    async (fieldKey: string, value: TPriorityDegree | null) => {
      await updateDisclosureField(fieldKey as any, value?.id ?? null);
    },
    [updateDisclosureField]
  );

  const handleEnableDisclosure = useCallback(async () => {
    try {
      await enableDisclosureMutation({
        id: disclosure.id,
        visitResult: null,
        visitReason: null,
        visitNote: null,
        ratingId: null,
        isCustomRating: false,
        customRating: null,
        ratingNote: null,
      }).unwrap();
      notifySuccess(STRINGS.action_done_successfully);
    } catch (error) {
      notifyError(error);
    }
  }, [disclosure.id, enableDisclosureMutation]);

  return (
    <>
      <Card>
        <Header title={STRINGS.the_patient} showBackButton />
        <BeneficiaryCommonCard
          canEditPatient
          isDisclosurePage
          beneficiary={disclosure.patient}
          disclosureId={disclosure.id}
        />
        <Divider sx={{ my: 2 }} />
        <Stack gap={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button
              variant="text"
              onClick={() => setShowSubPatients(!showSubPatients)}
              endIcon={
                <ExpandMore
                  sx={{
                    transform: showSubPatients ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              }
              startIcon={<People />}
              sx={{ px: 0 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {STRINGS.sub_patients}
              </Typography>
              <Chip
                label={subPatients?.length || 0}
                size="small"
                sx={{ ml: 1 }}
                color={subPatients?.length ? 'primary' : 'default'}
              />
            </Button>

            {!isArchived && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => navigate(`/disclosures/${disclosure.id}/sub-patient/action`)}
              >
                {STRINGS.add}
              </Button>
            )}
          </Stack>
          <Collapse in={showSubPatients}>
            <Stack gap={2}>
              {!subPatients || subPatients.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {STRINGS.no_sub_patients}
                </Typography>
              ) : (
                subPatients.map((subPatient) => (
                  <DisclosureSubPatientCard
                    key={subPatient.id}
                    subPatient={subPatient}
                    onEdit={
                      !isArchived
                        ? (sp) => navigate(`/disclosures/${disclosure.id}/sub-patient/action?id=${sp.id}`)
                        : undefined
                    }
                  />
                ))
              )}
            </Stack>
          </Collapse>
        </Stack>
      </Card>
      <Card>
        <Header title={STRINGS.the_disclosure} />
        <Stack gap={2}>
          {isArchived && (
            <Chip
              icon={<Archive />}
              label={STRINGS.archived}
              color="warning"
              size="medium"
              sx={{
                alignSelf: 'flex-start',
              }}
            />
          )}
          <DetailItem icon={<InfoOutline />} label={STRINGS.status} value={STRINGS[disclosure.status]} />
          <DetailItem
            icon={<LightbulbOutlinedIcon />}
            label={STRINGS.type}
            value={STRINGS[disclosure.type] ?? STRINGS.none}
          />
          <DetailItem
            icon={<DirectionsWalk />}
            label={STRINGS.disclosure_scout}
            value={
              <InlineEditWrapper
                editValue={disclosure.scout ? { id: disclosure.scout.id, name: disclosure.scout.name } : null}
                fieldType="autocomplete"
                fieldKey="scoutId"
                onSave={handleScoutUpdate}
                canEdit={currentCanEditDisclosure && !isArchived}
                autocompleteOptions={scoutOptions}
                getOptionLabel={(option: TAutocompleteItem) => option.name}
              >
                {disclosure.scout?.name ?? STRINGS.none}
              </InlineEditWrapper>
            }
          />

          <DetailItem
            icon={<Info />}
            label={STRINGS.priority_degree}
            value={
              <InlineEditWrapper
                editValue={disclosure.priority}
                fieldType="autocomplete"
                fieldKey="priorityId"
                onSave={handlePriorityUpdate}
                canEdit={currentCanEditDisclosure && !isArchived}
                autocompleteOptions={priorities}
                getOptionLabel={(option: TPriorityDegree) => option.name}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="subtitle2">{disclosure.priority.name}</Typography>
                  {isLate && (
                    <Chip
                      size="small"
                      color="error"
                      label={`${STRINGS.disclosure_is_late} ( ${lateDaysCount} ${STRINGS.day} )`}
                      sx={{
                        zIndex: 1,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: disclosure.priority.color,
                      borderRadius: '100%',
                    }}
                  />
                </Stack>
              </InlineEditWrapper>
            }
          />
          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.disclosure_created_at}
            value={`${formatDateTime(disclosure.createdAt)} ${isNullOrUndefined(disclosure.createdBy?.name) ? '' : `${STRINGS.by} ${disclosure.createdBy?.name}`}`}
          />

          <DetailItem
            icon={<History />}
            label={STRINGS.disclosure_updated_at}
            value={
              !disclosure.updatedAt
                ? STRINGS.none
                : `${formatDateTime(disclosure.updatedAt)} ${isNullOrUndefined(disclosure.updatedBy?.name) ? '' : `${STRINGS.by} ${disclosure.updatedBy?.name}`}`
            }
          />
          <DetailItem
            icon={<Comment />}
            label={STRINGS.initial_note}
            copyText={disclosure.initialNote ?? null}
            value={
              <InlineEditWrapper
                editValue={disclosure.initialNote}
                fieldType="textarea"
                fieldKey="initialNote"
                onSave={updateDisclosureField}
                canEdit={currentCanEditDisclosure && !isArchived}
                validation={disclosureFieldSchemas.initialNote}
              >
                {disclosure.initialNote || STRINGS.none}
              </InlineEditWrapper>
            }
          />
          {!isArchived && (
            <Stack sx={{ flexDirection: 'row', gap: 1 }}>
              {currentCanEditDisclosure && (
                <Link style={{ flex: 1 }} to={`/disclosures/action?disclosureId=${disclosure.id}`}>
                  <Button fullWidth startIcon={<Edit />}>
                    {STRINGS.edit} {STRINGS.the_disclosure}
                  </Button>
                </Link>
              )}
              {canEnableDisclosure && (
                <Button
                  color="success"
                  variant="outlined"
                  disabled={isEnablingDisclosure}
                  onClick={handleEnableDisclosure}
                >
                  {STRINGS.enable_disclosure}
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};

export default DisclosureHeaderCard;
