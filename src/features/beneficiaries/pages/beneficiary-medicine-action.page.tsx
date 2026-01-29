import React, { useEffect } from 'react';
import { Box, Stack, TextField, Typography, Chip, Card } from '@mui/material';
import { z } from 'zod';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import useReducerState from '@/core/hooks/use-reducer.hook';

import { DOSE_OPTIONS } from '@/features/banks/types/medicines.types';
import MedicinesAutocomplete from '@/features/banks/components/medicines/medicines-autocomplete/medicines-autocomplete.component';
import type { TAddBeneficiaryMedicinePayload, TUpdateBeneficiaryMedicinePayload } from '../types/beneficiary.types';
import beneficiaryApi from '../api/beneficiary.api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { skipToken } from '@reduxjs/toolkit/query';
import type { TMedicinesAutocompleteItem } from '@/features/autocomplete/types/autcomplete.types';

const BeneficiaryMedicineSchema = z.object({
  patientId: z.string().min(1, { message: STRINGS.schema_required }),
  medicineId: z.string().min(1, { message: STRINGS.schema_required }),
  dosePerIntake: z.number().gt(0, { message: STRINGS.schema_required }),
  intakeFrequency: z
    .number({ invalid_type_error: STRINGS.schema_intake_freq_number })
    .min(0, { message: STRINGS.schema_intake_freq_min }),
  note: z.string().optional().nullable(),
});

type TFormValues = z.infer<typeof BeneficiaryMedicineSchema>;

const BeneficiaryMedicineActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const medicineId = searchParams.get('id') ?? undefined;
  const { id: patientId } = useParams();

  const { data: oldBeneficiaryMedicine, isLoading: isLoadingById } = beneficiaryApi.useGetBeneficiaryMedicineByIdQuery(
    medicineId ? { id: medicineId } : skipToken
  );

  const [addPatientMedicine, { isLoading: isAdding }] = beneficiaryApi.useAddBeneficiaryMedicineMutation();
  const [updatePatientMedicine, { isLoading: isUpdating }] = beneficiaryApi.useUpdateBeneficiaryMedicineMutation();

  const [values, setValues] = useReducerState<TFormValues & { med: TMedicinesAutocompleteItem | null }>({
    patientId: oldBeneficiaryMedicine?.patientId ?? patientId ?? '',
    medicineId: oldBeneficiaryMedicine?.medicineId ?? '',
    dosePerIntake: oldBeneficiaryMedicine?.dosePerIntake ?? 500,
    intakeFrequency: oldBeneficiaryMedicine?.intakeFrequency ? Number(oldBeneficiaryMedicine.intakeFrequency) : 1,
    note: oldBeneficiaryMedicine?.note ?? '',
    med: null,
  });

  const [errors, setErrors] = React.useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (oldBeneficiaryMedicine?.medicine?.doseVariants) {
      const dv = oldBeneficiaryMedicine.medicine.doseVariants;
      if (!dv.includes(oldBeneficiaryMedicine.dosePerIntake)) {
        setValues({ dosePerIntake: dv[0] ?? 0 });
      } else {
        setValues({ med: oldBeneficiaryMedicine.medicine });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : '';
  };

  const handleMedicineChange = (medicine: TMedicinesAutocompleteItem | null) => {
    const medId = medicine?.id ?? '';
    setValues({ medicineId: medId, med: medicine });
    setErrors((prev) => prev.filter((er) => er.path[0] !== 'medicineId'));

    if (medicine?.doseVariants?.length) {
      const curDose = values.dosePerIntake;
      if (!medicine.doseVariants.includes(curDose)) {
        setValues({ dosePerIntake: medicine.doseVariants[0] });
      }
    } else {
      setValues({ dosePerIntake: 0 });
    }
  };

  const handleDoseSelect = (dose: number) => {
    setValues({ dosePerIntake: dose });
    setErrors((prev) => prev.filter((er) => er.path[0] !== 'dosePerIntake'));
  };

  const handleFrequencyChange = (v: string) => {
    const num = isNaN(Number(v)) ? 0 : Number(v);
    setValues({ intakeFrequency: num });
    setErrors((prev) => prev.filter((er) => er.path[0] !== 'intakeFrequency'));
  };

  const handleNoteChange = (v: string) => setValues({ note: v });

  const handleSubmit = async () => {
    try {
      const toValidate = {
        ...values,
        intakeFrequency: Number(values.intakeFrequency),
      };
      const parsed = BeneficiaryMedicineSchema.parse(toValidate);

      if (oldBeneficiaryMedicine) {
        const payload: TUpdateBeneficiaryMedicinePayload = {
          id: oldBeneficiaryMedicine.id,
          patientId: parsed.patientId,
          medicineId: parsed.medicineId,
          dosePerIntake: parsed.dosePerIntake,
          intakeFrequency: String(parsed.intakeFrequency),
          note: parsed.note ?? '',
        };
        await updatePatientMedicine(payload).unwrap();
      } else {
        const payload: TAddBeneficiaryMedicinePayload = {
          patientId: parsed.patientId,
          medicineId: parsed.medicineId,
          dosePerIntake: parsed.dosePerIntake,
          intakeFrequency: String(parsed.intakeFrequency),
          note: parsed.note ?? '',
        };
        await addPatientMedicine(payload).unwrap();
      }
      notifySuccess(oldBeneficiaryMedicine ? STRINGS.edited_successfully : STRINGS.added_successfully);
      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };

  const isLoading = isAdding || isUpdating || isLoadingById;
  const doseVariantsForSelected = values.med?.doseVariants ?? DOSE_OPTIONS;

  return (
    <Card sx={{ p: 2 }}>
      <Typography sx={{ pb: 2 }}>
        {oldBeneficiaryMedicine ? STRINGS.edit_beneficiary_medicine : STRINGS.add_beneficiary_medicine}
      </Typography>
      <Stack gap={2}>
        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'end' }}>
          <MedicinesAutocomplete
            defaultValueId={oldBeneficiaryMedicine?.medicineId}
            value={values.med}
            onChange={(m) => handleMedicineChange(m)}
            errorText={getErrorForField('medicineId')}
          />
          <TextField
            fullWidth
            label={STRINGS.intake_frequency_per_day}
            value={values.intakeFrequency as unknown as string}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            error={!!getErrorForField('intakeFrequency')}
            helperText={getErrorForField('intakeFrequency')}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
          />
        </Stack>
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

            {!doseVariantsForSelected.includes(values.dosePerIntake as any) && values.dosePerIntake > 0 ? (
              <Chip key={`custom-${values.dosePerIntake}`} label={`${values.dosePerIntake} mg`} color="secondary" />
            ) : null}
          </Stack>

          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
            {getErrorForField('dosePerIntake')}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label={STRINGS.note}
          value={values.note ?? ''}
          onChange={(e) => handleNoteChange(e.target.value)}
          multiline
          minRows={2}
        />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryMedicineActionPage;
