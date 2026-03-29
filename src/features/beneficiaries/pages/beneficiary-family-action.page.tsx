/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Card, IconButton, Paper, Stack, Typography } from '@mui/material';
import { z } from 'zod';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';

import { getErrorMessage, getStringsLabel } from '@/core/helpers/helpers';
import type { TAddFamilyMemberPayload, TGender, TKinship } from '../types/beneficiary.types';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Add, DeleteOutline, Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import useForm from '@/core/hooks/use-form.hook';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import FormSelectInput from '@/core/components/common/inputs/form-select-input.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FormNumberInput from '@/core/components/common/inputs/form-number-input.component';
import Header from '@/core/components/common/header/header';
import useFamilyMembersMutation from '../hooks/family-members-mutation.hook';
import { useBeneficiaryFamilyMemberLoader } from '../hooks/beneficiary-family-member-loader.hook';

const FamilyMemberSchema = z.object({
  name: z.string().min(1, { message: STRINGS.schema_required }).max(200),
  birthDate: z.string().min(1, { message: STRINGS.schema_required }),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: STRINGS.schema_required }),
  }),
  kinshep: z.enum(['partner', 'child', 'parent', 'brother', 'grandparent', 'grandchild'], {
    errorMap: () => ({ message: STRINGS.schema_required }),
  }),
  jobOrSchool: z.string(),
  residential: z.string(),
  note: z.string().optional(),
  nationalNumber: z.string(),
  kidsCount: z.string().optional(),
});

const GENDERS: TGender[] = ['male', 'female'];
const KINSHEP: TKinship[] = ['partner', 'child', 'parent', 'brother', 'grandparent', 'grandchild'];

type TFamilyFormValues = z.infer<typeof FamilyMemberSchema>;

const createInitialFormState = (): TFamilyFormValues => ({
  birthDate: '',
  gender: 'male' as TGender,
  kinshep: 'partner' as TKinship,
  name: '',
  jobOrSchool: '',
  note: '',
  residential: '',
  kidsCount: '',
  nationalNumber: '',
});

type TFamilyDraft = ReturnType<typeof createInitialFormState> & { id: string };

type PartialFamilyState = Partial<TFamilyFormValues>;

const normalizeDraftState = (state: PartialFamilyState) => ({
  birthDate: state.birthDate ?? '',
  gender: (state.gender as TGender) ?? 'male',
  kinshep: (state.kinshep as TKinship) ?? 'partner',
  name: state.name ?? '',
  jobOrSchool: state.jobOrSchool ?? '',
  note: state.note ?? '',
  residential: state.residential ?? '',
  kidsCount: state.kidsCount ?? '',
  nationalNumber: state.nationalNumber ?? '',
});

const hasPendingFormValues = (state: ReturnType<typeof createInitialFormState>) => {
  return [
    state.name,
    state.birthDate,
    state.nationalNumber,
    state.jobOrSchool,
    state.residential,
    state.note ?? '',
    state.kidsCount ?? '',
  ].some((value) => (value ?? '').toString().trim().length > 0);
};

const BeneficiaryFamilyActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('id') ?? undefined;
  const { id: patientId } = useParams();

  const { data: familyMemberData, isLoading: isFetchingFamilyMemberData } = useBeneficiaryFamilyMemberLoader(memberId);

  const [mutateFamilyMembers, { isLoading: isMutatingFamilyMember }] = useFamilyMembersMutation();
  // const [addFamilyMember, { isLoading: isAdding }] = beneficiaryApi.useAddFamilyMemberMutation();
  // const [updateFamilyMember, { isLoading: isUpdating }] = beneficiaryApi.useUpdateFamilyMemberMutation();

  const { formState, formErrors, handleSubmit, setFormState, setFormErrors } = useForm({
    schema: FamilyMemberSchema,
    initalState: createInitialFormState(),
  });

  const [queuedFamilyMembers, setQueuedFamilyMembers] = useState<TFamilyDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const draftsCounter = useRef(0);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const isEditMode = useMemo(() => !!memberId, [memberId]);

  const generateDraftId = useCallback(() => {
    draftsCounter.current += 1;
    return `family-draft-${draftsCounter.current}`;
  }, []);

  const resetForm = useCallback(() => {
    setActiveDraftId(null);
    setFormState(createInitialFormState());
    setFormErrors({} as any);
  }, [setFormErrors, setFormState]);

  const handleSubmitForm = async () => {
    const { isValid, result } = await handleSubmit();
    if (!isValid) return;
    if (!isEditMode) {
      notifyError(STRINGS.queue_family_before_save);
      return;
    }
    const dto: TAddFamilyMemberPayload = {
      birthDate: result.birthDate,
      gender: result.gender,
      kidsCount: isNaN(Number(result.kidsCount)) || result.kidsCount === '' ? null : Number(result.kidsCount),
      kinshep: result.kinshep,
      name: result.name,
      nationalNumber: result.nationalNumber || null,
      note: result.note || null,
      patientId: patientId!,
      residential: result.residential || null,
      jobOrSchool: result.jobOrSchool || null,
    };

    try {
      if (memberId) {
        await mutateFamilyMembers({ type: 'UPDATE', dto: { ...dto, id: memberId } });
      } else {
        await mutateFamilyMembers({ type: 'INSERT', dto });
      }

      notifySuccess(memberId ? STRINGS.edited_successfully : STRINGS.added_successfully);
      navigate(-1);
    } catch (err: any) {
      notifyError(getErrorMessage(err));
    }
  };

  const handleSaveQueuedDrafts = async () => {
    const draftsToPersist = [...queuedFamilyMembers];
    const shouldQueueCurrentForm = !activeDraftId && hasPendingFormValues(formState);

    if (shouldQueueCurrentForm) {
      const { isValid, result } = await handleSubmit();
      if (!isValid) return;
      const normalizedState = normalizeDraftState(result);
      const newDraft: TFamilyDraft = {
        id: generateDraftId(),
        ...normalizedState,
      };
      draftsToPersist.push(newDraft);
      setQueuedFamilyMembers([...draftsToPersist]);
      setActiveDraftId(newDraft.id);
      setFormState({ ...normalizedState });
    }

    if (!draftsToPersist.length) {
      notifyError(STRINGS.queue_family_before_save);
      return;
    }

    const payloads: TAddFamilyMemberPayload[] = [];

    for (const draft of draftsToPersist) {
      try {
        const { birthDate, gender, kinshep, name, jobOrSchool, note, residential, kidsCount, nationalNumber } = draft;
        const parsed = FamilyMemberSchema.parse({
          birthDate,
          gender,
          kinshep,
          name,
          jobOrSchool,
          note,
          residential,
          kidsCount,
          nationalNumber,
        });

        payloads.push({
          birthDate: parsed.birthDate,
          gender: parsed.gender,
          kinshep: parsed.kinshep,
          name: parsed.name,
          nationalNumber: parsed.nationalNumber || null,
          note: parsed.note || null,
          patientId: patientId!,
          residential: parsed.residential || null,
          jobOrSchool: parsed.jobOrSchool || null,
          kidsCount: isNaN(Number(parsed.kidsCount)) || parsed.kidsCount === '' ? null : Number(parsed.kidsCount),
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          setActiveDraftId(draft.id);
          const { id: _id, ...rest } = draft;
          setFormState({ ...rest });
          setFormErrors(err.errors as any);
        }
        throw err;
      }
    }

    for (const payload of payloads) {
      await mutateFamilyMembers({ type: 'INSERT', dto: payload });
    }

    notifySuccess(STRINGS.added_successfully);
    navigate(-1);
  };

  const isLoading = isMutatingFamilyMember || isFetchingFamilyMemberData;

  const handleFieldChange = useCallback(
    (field: keyof ReturnType<typeof createInitialFormState>, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      setFormErrors({} as any);
    },
    [setFormErrors, setFormState]
  );

  const handleAddDraft = useCallback(async () => {
    const { isValid, result } = await handleSubmit();
    if (!isValid) return;

    const normalizedState = normalizeDraftState(result);

    if (activeDraftId) {
      setQueuedFamilyMembers((prev) =>
        prev.map((draft) => (draft.id === activeDraftId ? { ...draft, ...normalizedState } : draft))
      );
    } else {
      const newDraft: TFamilyDraft = {
        id: generateDraftId(),
        ...normalizedState,
      };
      setQueuedFamilyMembers((prev) => [...prev, newDraft]);
    }

    resetForm();
    nameInputRef.current?.focus();
  }, [activeDraftId, generateDraftId, handleSubmit, resetForm]);

  useEffect(() => {
    if (isEditMode || !activeDraftId) return;

    setQueuedFamilyMembers((prev) => {
      const exists = prev.some((draft) => draft.id === activeDraftId);
      if (!exists) return prev;
      const normalizedState = normalizeDraftState(formState);
      return prev.map((draft) => (draft.id === activeDraftId ? { ...draft, ...normalizedState } : draft));
    });
  }, [formState, activeDraftId, isEditMode]);

  const handleQueuedSelect = (id: string) => {
    const draft = queuedFamilyMembers.find((item) => item.id === id);
    if (!draft) return;
    setActiveDraftId(id);
    const { id: _id, ...rest } = draft;
    setFormState({ ...rest });
    setFormErrors({} as any);
  };

  const handleQueuedRemove = (id: string) => {
    setQueuedFamilyMembers((prev) => {
      const next = prev.filter((draft) => draft.id !== id);
      if (id === activeDraftId) {
        const fallback = next[next.length - 1];
        if (fallback) {
          setActiveDraftId(fallback.id);
          const { id: _id, ...rest } = fallback;
          setFormState({ ...rest });
        } else {
          resetForm();
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isEditMode) return;
    if (familyMemberData) {
      setFormState((prev) => ({
        ...prev,
        name: familyMemberData.name,
        birthDate: familyMemberData.birthDate,
        gender: familyMemberData.gender,
        jobOrSchool: familyMemberData.jobOrSchool ?? '',
        kinshep: familyMemberData.kinshep,
        note: familyMemberData.note ?? '',
        residential: familyMemberData.residential ?? '',
        kidsCount: familyMemberData.kidsCount ? String(familyMemberData.kidsCount) : '',
        nationalNumber: familyMemberData.nationalNumber ?? '',
      }));
    }
  }, [familyMemberData, isEditMode, setFormState]);

  return (
    <Card>
      <Header title={memberId ? STRINGS.edit_family_member : STRINGS.add_family_member} showBackButton />
      <Stack gap={2}>
        <FormTextFieldInput
          required
          label={STRINGS.name}
          value={formState.name}
          onChange={(v) => handleFieldChange('name', v)}
          errorText={formErrors.name?.[0].message}
          inputRef={nameInputRef}
        />

        <FormDateInput
          format="yyyy"
          views={['year']}
          required
          disableFuture
          label={STRINGS.birth_date}
          value={formState.birthDate}
          onChange={(newDate) => {
            handleFieldChange('birthDate', newDate);
          }}
          errorText={formErrors.birthDate?.[0].message}
        />
        <FormTextFieldInput
          label={STRINGS.national_number}
          value={formState.nationalNumber}
          onChange={(v) => handleFieldChange('nationalNumber', v)}
          errorText={formErrors.nationalNumber?.[0].message}
        />

        <Stack sx={{ flexDirection: 'row', gap: 2 }}>
          <FormSelectInput
            value={formState.gender}
            required
            disableClearable
            label={STRINGS.gender}
            options={GENDERS.map((g) => ({ id: g, label: STRINGS[g] }))}
            onChange={(v) => handleFieldChange('gender', v as string)}
            getOptionLabel={(option) => option.label}
            errorText={formErrors.gender?.[0].message}
          />
          <FormSelectInput
            value={formState.kinshep}
            required
            disableClearable
            label={STRINGS.kinship}
            options={KINSHEP.map((k) => ({ id: k, label: getStringsLabel({ key: 'kinship', val: k }) }))}
            onChange={(v) => handleFieldChange('kinshep', v as string)}
            getOptionLabel={(option) => option.label}
            errorText={formErrors.kinshep?.[0].message}
          />
          <FormNumberInput
            value={formState.kidsCount}
            label={STRINGS.kids_count}
            onChange={(v) => handleFieldChange('kidsCount', String(v))}
            errorText={formErrors.kidsCount?.[0].message}
          />
        </Stack>
        <FormTextFieldInput
          label={STRINGS.job_or_school}
          value={formState.jobOrSchool}
          onChange={(v) => handleFieldChange('jobOrSchool', v)}
          errorText={formErrors.jobOrSchool?.[0].message}
        />

        <FormTextFieldInput
          label={STRINGS.residential}
          value={formState.residential}
          onChange={(v) => handleFieldChange('residential', v)}
          errorText={formErrors.residential?.[0].message}
        />

        <FormTextAreaInput
          rows={2}
          label={STRINGS.note}
          value={formState.note}
          onChange={(v) => handleFieldChange('note', v)}
          errorText={formErrors.note?.[0].message}
        />

        {!isEditMode && (
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddDraft} disabled={isLoading}>
            {STRINGS.add_family_member_to_list}
          </Button>
        )}

        {!isEditMode && queuedFamilyMembers.length > 0 && (
          <Box>
            <Typography variant="subtitle2">{STRINGS.queued_family_members}</Typography>
            <Typography variant="caption" color="text.secondary">
              {STRINGS.queued_family_members_hint}
            </Typography>
            <Stack gap={1} sx={{ mt: 1 }}>
              {queuedFamilyMembers.map((draft) => (
                <Paper
                  key={draft.id}
                  variant={draft.id === activeDraftId ? 'elevation' : 'outlined'}
                  sx={{
                    p: 1,
                    borderColor: draft.id === activeDraftId ? 'primary.main' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleQueuedSelect(draft.id)}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {draft.name || STRINGS.unknown}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getStringsLabel({ key: 'kinship', val: draft.kinshep })}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleQueuedRemove(draft.id);
                      }}
                    >
                      <DeleteOutline fontSize="small" color="error" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={isEditMode ? handleSubmitForm : handleSaveQueuedDrafts}
        disabled={isLoading || (!isEditMode && queuedFamilyMembers.length === 0)}
      />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryFamilyActionPage;
