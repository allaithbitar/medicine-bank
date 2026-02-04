import { useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography, Chip, Card, InputAdornment, Button } from '@mui/material';
import { z } from 'zod';
import {
  ALLOWED_FORMS,
  DOSE_OPTIONS,
  type TAddMedicinePayload,
  type TFormValue,
  type TUpdateMedicinePayload,
} from '@/features/banks/types/medicines.types';
import medicinesApi from '@/features/banks/api/medicines-api/medicines-api';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import useReducerState from '@/core/hooks/use-reducer.hook';
import { getStringsLabel } from '@/core/helpers/helpers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { skipToken } from '@reduxjs/toolkit/query/react';
import Header from '@/core/components/common/header/header';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormSelectInput from '@/core/components/common/inputs/form-select-input.component';

const MedicineSchema = z.object({
  name: z.string().min(1, { message: STRINGS.schema_required }).max(200),
  form: z.enum(ALLOWED_FORMS, {
    errorMap: () => ({ message: STRINGS.schema_required }),
  }),
  doseVariants: z.array(z.number()).min(1, {
    message: STRINGS.schema_dose_required,
  }),
});

type TFormValues = z.infer<typeof MedicineSchema>;

const MedicineActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id') ?? undefined;

  const { data: medicineById, isLoading: isLoadingById } = medicinesApi.useGetMedicineByIdQuery(
    id ? { id } : skipToken
  );

  const initialMedicine = useMemo(() => {
    if (medicineById) return medicineById;
  }, [medicineById]);

  const [addMedicine, { isLoading: isAdding }] = medicinesApi.useAddMedicineMutation();
  const [updateMedicine, { isLoading: isUpdating }] = medicinesApi.useUpdateMedicineMutation();

  const [values, setValues] = useReducerState<TFormValues>({
    name: initialMedicine?.name ?? '',
    form: (initialMedicine?.form as TFormValue) ?? 'pill',
    doseVariants: initialMedicine?.doseVariants ?? ([] as number[]),
  });

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [customDoseInput, setCustomDoseInput] = useState<string>('');

  useEffect(() => {
    if (!initialMedicine) return;
    setValues({
      name: initialMedicine.name ?? '',
      form: (initialMedicine.form as TFormValue) ?? 'pill',
      doseVariants: initialMedicine.doseVariants ?? [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMedicine?.id]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : '';
  };

  const handleNameChange = (v: string) => {
    setValues({ name: v });
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'name'));
  };

  const handleFormChange = (v: TFormValue) => {
    setValues((prev) => ({ ...prev, form: v }));
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'form'));
  };

  const handleDoseToggle = (dose: number) => {
    const exists = values.doseVariants.includes(dose);
    setValues({
      doseVariants: exists
        ? values.doseVariants.filter((d) => d !== dose)
        : [...values.doseVariants, dose].sort((a, b) => a - b),
    });
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'doseVariants'));
  };

  const handleRemoveDose = (dose: number) => {
    setValues({
      doseVariants: values.doseVariants.filter((d) => d !== dose),
    });
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'doseVariants'));
  };

  const handleAddCustomDose = () => {
    const trimmed = customDoseInput.trim();
    if (!trimmed) return;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      notifyError('Enter a valid positive number for dose');
      return;
    }

    if (values.doseVariants.includes(parsed)) {
      setCustomDoseInput('');
      return;
    }

    setValues({
      doseVariants: [...values.doseVariants, parsed].sort((a, b) => a - b),
    });
    setCustomDoseInput('');
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'doseVariants'));
  };

  const onCustomDoseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomDose();
    }
  };

  const handleSubmit = async () => {
    try {
      const parsed = MedicineSchema.parse(values);

      if (initialMedicine) {
        const payload: TUpdateMedicinePayload = {
          id: initialMedicine.id,
          name: parsed.name,
          form: parsed.form,
          doseVariants: parsed.doseVariants,
        };
        await updateMedicine(payload).unwrap();
      } else {
        const payload: TAddMedicinePayload = {
          name: parsed.name,
          form: parsed.form,
          doseVariants: parsed.doseVariants,
        };
        await addMedicine(payload).unwrap();
      }

      notifySuccess(initialMedicine ? STRINGS.edited_successfully : STRINGS.added_successfully);
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

  return (
    <Card>
      <Header title={initialMedicine ? STRINGS.edit_medicine : STRINGS.add_medicine} />
      <Stack gap={2}>
        <FormTextFieldInput
          required
          label={STRINGS.name}
          value={values.name}
          onChange={handleNameChange}
          error={!!getErrorForField('name')}
          errorText={getErrorForField('name')}
        />
        <FormSelectInput
          label={STRINGS.med_form}
          value={values.form}
          required
          disableClearable
          options={ALLOWED_FORMS.map((f) => ({ id: f, label: getStringsLabel({ key: 'med_form', val: f }) }))}
          onChange={(v) => handleFormChange(v as TFormValue)}
          getOptionLabel={(option) => option.label}
          errorText={getErrorForField('form')}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.dose_variants}
          </Typography>
          <Stack gap={2}>
            <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 1 }}>
              <FormTextFieldInput
                label={STRINGS.custom_dose}
                value={customDoseInput}
                onChange={(value) => setCustomDoseInput(value)}
                onKeyDown={onCustomDoseKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <Button size="small" variant="contained" onClick={handleAddCustomDose}>
                      {STRINGS.add}
                    </Button>
                  </InputAdornment>
                }
                size="small"
                type="number"
              />
            </Stack>
            <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
              {DOSE_OPTIONS.map((d) => {
                const selected = values.doseVariants.includes(d);
                return (
                  <Chip
                    key={d}
                    label={`${d} mg`}
                    color={selected ? 'primary' : 'default'}
                    onClick={() => handleDoseToggle(d)}
                    clickable
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
              {values.doseVariants
                .filter((d) => !DOSE_OPTIONS.includes(d as any))
                .map((d) => (
                  <Chip
                    key={d}
                    label={`${d} mg`}
                    color="secondary"
                    onClick={() => handleDoseToggle(d)}
                    onDelete={() => handleRemoveDose(d)}
                    deleteIcon={<span style={{ fontSize: 12 }}>×</span>}
                  />
                ))}
            </Stack>
          </Stack>

          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
            {getErrorForField('doseVariants')}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {STRINGS.select_one_or_more_doses}
          </Typography>
        </Box>
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default MedicineActionPage;
