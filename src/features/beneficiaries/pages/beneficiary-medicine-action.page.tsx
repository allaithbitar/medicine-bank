import React, { useEffect } from 'react';
import { Box, Stack, Typography, Chip, Card, IconButton, Paper } from '@mui/material';
import { z } from 'zod';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import useReducerState from '@/core/hooks/use-reducer.hook';

import { DOSE_OPTIONS } from '@/features/banks/types/medicines.types';
import MedicinesAutocomplete from '@/features/banks/components/medicines/medicines-autocomplete/medicines-autocomplete.component';
import type { TAddBeneficiaryMedicinePayload, TUpdateBeneficiaryMedicinePayload } from '../types/beneficiary.types';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Add, DeleteOutline, Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import type { TMedicinesAutocompleteItem } from '@/features/autocomplete/types/autcomplete.types';
import Header from '@/core/components/common/header/header';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import useBeneficiaryMedicineMutation from '../hooks/beneficiary-medicines-mutation.hook';
import { useBeneficiaryMedicineLoader } from '../hooks/beneficiary-medicine-loader.hook';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import theme from '@/core/theme/index.theme';

const BeneficiaryMedicineSchema = z.object({
  medicineId: z.string().min(1, { message: STRINGS.schema_required }),
  dosePerIntake: z.number().optional(),
  intakeFrequency: z.string().nullable(),
  note: z.string().optional().nullable(),
});

type TFormValues = z.infer<typeof BeneficiaryMedicineSchema>;

type TFormState = TFormValues & { med: TMedicinesAutocompleteItem | null };
type TQueuedMedicine = TFormState & { id: string };

const createInitialFormState = (): TFormState => ({
  medicineId: '',
  dosePerIntake: undefined,
  intakeFrequency: '',
  note: '',
  med: null,
});

const BeneficiaryMedicineActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const medicineId = searchParams.get('id') ?? undefined;
  const { id: patientId } = useParams();

  const { data: oldBeneficiaryMedicine, isLoading: isLoadingById } = useBeneficiaryMedicineLoader(medicineId);
  const [mutateBeneficiaryMedicine, { isLoading: isMutatingBeneficiaryMedicine }] = useBeneficiaryMedicineMutation();

  const [values, setValues] = useReducerState<TFormState>(createInitialFormState());
  const [errors, setErrors] = React.useState<z.ZodIssue[]>([]);
  const [queuedMedicines, setQueuedMedicines] = React.useState<TQueuedMedicine[]>([]);
  const [activeDraftId, setActiveDraftId] = React.useState<string | null>(null);
  const draftIdRef = React.useRef(0);

  useEffect(() => {
    if (oldBeneficiaryMedicine) {
      setValues({
        medicineId: oldBeneficiaryMedicine?.medicineId ?? '',
        intakeFrequency: oldBeneficiaryMedicine?.intakeFrequency ? oldBeneficiaryMedicine.intakeFrequency : '',
        note: oldBeneficiaryMedicine?.note ?? '',
      });
      if (oldBeneficiaryMedicine?.medicine?.doseVariants) {
        const dv = oldBeneficiaryMedicine.medicine.doseVariants;
        if (!dv.includes(oldBeneficiaryMedicine.dosePerIntake)) {
          setValues({ dosePerIntake: dv[0] ?? 0 });
        } else {
          setValues({ med: oldBeneficiaryMedicine.medicine });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldBeneficiaryMedicine]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : '';
  };

  const generateDraftId = () => {
    draftIdRef.current += 1;
    return `medicine-draft-${draftIdRef.current}`;
  };

  const resetForm = React.useCallback(() => {
    setActiveDraftId(null);
    setValues(() => createInitialFormState());
    setErrors([]);
  }, [setValues]);

  const syncActiveDraft = React.useCallback(
    (update: Partial<TFormState>) => {
      setValues(update);
      if (!activeDraftId) return;
      setQueuedMedicines((prev) => prev.map((draft) => (draft.id === activeDraftId ? { ...draft, ...update } : draft)));
    },
    [activeDraftId, setValues]
  );

  const handleMedicineChange = (medicine: TMedicinesAutocompleteItem | null) => {
    if (oldBeneficiaryMedicine) {
      const medId = medicine?.id ?? '';
      setValues({ medicineId: medId, med: medicine });
      setErrors((prev) => prev.filter((er) => er.path[0] !== 'medicineId'));

      if (medicine?.doseVariants?.length) {
        const curDose = values.dosePerIntake;
        if (curDose && !medicine.doseVariants.includes(curDose)) {
          setValues({ dosePerIntake: medicine.doseVariants[0] });
        }
      } else {
        setValues({ dosePerIntake: 0 });
      }
      return;
    }

    if (!medicine) {
      resetForm();
      return;
    }

    const baseState: TFormState = {
      medicineId: medicine.id,
      med: medicine,
      dosePerIntake: medicine.doseVariants?.length ? medicine.doseVariants[0] : undefined,
      intakeFrequency: '',
      note: '',
    };

    const newDraft: TQueuedMedicine = {
      id: generateDraftId(),
      ...baseState,
    };

    setQueuedMedicines((prev) => [...prev, newDraft]);
    setActiveDraftId(newDraft.id);
    setValues(() => ({ ...baseState }));
    setErrors((prev) => prev.filter((er) => er.path[0] !== 'medicineId'));
  };

  const handleDoseSelect = (dose: number) => {
    if (dose === values.dosePerIntake) {
      syncActiveDraft({ dosePerIntake: undefined });
      setErrors((prev) => prev.filter((er) => er.path[0] !== 'dosePerIntake'));
      return;
    }
    syncActiveDraft({ dosePerIntake: dose });
    setErrors((prev) => prev.filter((er) => er.path[0] !== 'dosePerIntake'));
  };

  const handleFrequencyChange = (v: string) => {
    syncActiveDraft({ intakeFrequency: v });
    setErrors((prev) => prev.filter((er) => er.path[0] !== 'intakeFrequency'));
  };

  const handleNoteChange = (v: string) => syncActiveDraft({ note: v });

  const handleSubmit = async () => {
    try {
      const toValidate = {
        ...values,
        intakeFrequency: values.intakeFrequency,
      };
      const parsed = BeneficiaryMedicineSchema.parse(toValidate);

      if (oldBeneficiaryMedicine) {
        const payload: TUpdateBeneficiaryMedicinePayload = {
          id: oldBeneficiaryMedicine.id,
          patientId: patientId!,
          medicineId: parsed.medicineId,
          dosePerIntake: parsed.dosePerIntake,
          intakeFrequency: String(parsed.intakeFrequency),
          note: parsed.note || null,
        };
        await mutateBeneficiaryMedicine({ type: 'UPDATE', dto: payload });
      } else {
        if (!queuedMedicines.length) {
          notifyError(STRINGS.queue_medicine_before_save);
          return;
        }

        const payloads: TAddBeneficiaryMedicinePayload[] = [];

        for (const draft of queuedMedicines) {
          try {
            const parsedDraft = BeneficiaryMedicineSchema.parse({
              medicineId: draft.medicineId,
              dosePerIntake: draft.dosePerIntake,
              intakeFrequency: draft.intakeFrequency,
              note: draft.note,
            });

            payloads.push({
              patientId: patientId!,
              medicineId: parsedDraft.medicineId,
              dosePerIntake: parsedDraft.dosePerIntake,
              intakeFrequency: String(parsedDraft.intakeFrequency),
              note: parsedDraft.note || null,
            });
          } catch (validationErr) {
            if (validationErr instanceof z.ZodError) {
              setActiveDraftId(draft.id);
              setValues(() => ({
                medicineId: draft.medicineId,
                med: draft.med,
                dosePerIntake: draft.dosePerIntake,
                intakeFrequency: draft.intakeFrequency,
                note: draft.note ?? '',
              }));
              setErrors(validationErr.errors);
            }
            throw validationErr;
          }
        }

        for (const payload of payloads) {
          await mutateBeneficiaryMedicine({ type: 'INSERT', dto: payload });
        }
      }
      notifySuccess(oldBeneficiaryMedicine ? STRINGS.edited_successfully : STRINGS.added_successfully);
      navigate(-1);
    } catch (err: any) {
      console.log(err);

      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };

  const isLoading = isMutatingBeneficiaryMedicine || isLoadingById;
  const doseVariantsForSelected = values.med?.doseVariants ?? DOSE_OPTIONS;
  const disableSubmit = isLoading || (!oldBeneficiaryMedicine && queuedMedicines.length === 0);

  return (
    <Card sx={{ p: 2 }}>
      <Header
        title={oldBeneficiaryMedicine ? STRINGS.edit_beneficiary_medicine : STRINGS.add_beneficiary_medicine}
        showBackButton
      />
      <Stack gap={2}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'end' }}>
          <MedicinesAutocomplete
            defaultValueId={oldBeneficiaryMedicine?.medicineId}
            value={values.med}
            onChange={(m: TMedicinesAutocompleteItem | null) => handleMedicineChange(m)}
            errorText={getErrorForField('medicineId')}
          />
          <CustomIconButton size="small" onClick={() => navigate('/medicines/action')}>
            <Add sx={{ color: theme.palette.primary.main }} />
          </CustomIconButton>
        </Stack>
        <FormTextFieldInput
          label={STRINGS.intake_frequency}
          value={values.intakeFrequency as unknown as string}
          onChange={handleFrequencyChange}
          error={!!getErrorForField('intakeFrequency')}
          errorText={getErrorForField('intakeFrequency')}
        />
        {!!doseVariantsForSelected.length && values.med && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {STRINGS.dose_per_intake}
            </Typography>

            <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
              {doseVariantsForSelected.map((d) => {
                const selected = values.dosePerIntake === d;
                return (
                  <Chip
                    key={d}
                    label={`${d} mg`}
                    color={selected ? 'primary' : 'default'}
                    onClick={() => handleDoseSelect(d)}
                    clickable
                  />
                );
              })}
              {!doseVariantsForSelected.includes(values.dosePerIntake as any) && (values.dosePerIntake || 0) > 0 ? (
                <Chip key={`custom-${values.dosePerIntake}`} label={`${values.dosePerIntake} mg`} color="secondary" />
              ) : null}
            </Stack>
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {getErrorForField('dosePerIntake')}
            </Typography>
          </Box>
        )}
        <FormTextAreaInput label={STRINGS.note} value={values.note ?? ''} onChange={handleNoteChange} />
        {!oldBeneficiaryMedicine && queuedMedicines.length > 0 && (
          <Box>
            <Typography variant="subtitle2">{STRINGS.queued_medicines}</Typography>
            <Typography variant="caption" color="text.secondary">
              {STRINGS.queued_medicines_hint}
            </Typography>
            <Stack gap={1} sx={{ mt: 1 }}>
              {queuedMedicines.map((draft) => (
                <Paper
                  key={draft.id}
                  variant={draft.id === activeDraftId ? 'elevation' : 'outlined'}
                  sx={{
                    p: 1,
                    borderColor: draft.id === activeDraftId ? 'primary.main' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setActiveDraftId(draft.id);
                    setValues(() => ({
                      medicineId: draft.medicineId,
                      med: draft.med,
                      dosePerIntake: draft.dosePerIntake,
                      intakeFrequency: draft.intakeFrequency,
                      note: draft.note ?? '',
                    }));
                    setErrors([]);
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {draft.med?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {draft.intakeFrequency || STRINGS.none}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setQueuedMedicines((prev) => {
                          const next = prev.filter((item) => item.id !== draft.id);
                          if (draft.id === activeDraftId) {
                            const fallback = next[next.length - 1];
                            if (fallback) {
                              setActiveDraftId(fallback.id);
                              setValues(() => ({
                                medicineId: fallback.medicineId,
                                med: fallback.med,
                                dosePerIntake: fallback.dosePerIntake,
                                intakeFrequency: fallback.intakeFrequency,
                                note: fallback.note ?? '',
                              }));
                            } else {
                              resetForm();
                            }
                          }
                          return next;
                        });
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
      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={disableSubmit} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryMedicineActionPage;
