import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import { Stack, Autocomplete, TextField } from '@mui/material';
import z from 'zod';
import { type TDisclosure } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import { useEffect, useImperativeHandle, type Ref } from 'react';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FieldSet from '@/core/components/common/fieldset/fieldset.component';

const StatusSchema = z
  .object({
    id: z.string(),
    label: z.string(),
  })
  .optional();

const createDisclosureDetailsSchema = () =>
  z.object({
    job_or_school: z.string().optional(),
    patient_or_surgeries: z.string().optional(),
    expenses: z.string().optional(),
    home_condition_status: StatusSchema,
    home_condition_note: z.string().optional(),
    home_status: StatusSchema,
    home_status_note: z.string().optional(),
    electricity: z.string().optional(),
    pons: z.string().optional(),
    cons: z.string().optional(),
  });

export type TDisclosureDetailsFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<ReturnType<typeof createDisclosureDetailsSchema>>>>;
};

type TProps = {
  ref: Ref<TDisclosureDetailsFormHandlers>;
  disclosureData?: TDisclosure;
};
const HOME_CONDITION_OPTIONS = [
  {
    id: 'bad',
    label: STRINGS.common_bad,
  },
  {
    id: 'normal',
    label: STRINGS.common_normal,
  },
  {
    id: 'good',
    label: STRINGS.common_good,
  },
  {
    id: 'excellent',
    label: STRINGS.common_excellent,
  },
];
const HOME_STATUS_OPTIONS = [
  {
    id: 'ownership',
    label: STRINGS.common_ownership,
  },
  {
    id: 'rent',
    label: STRINGS.common_rent,
  },
  {
    id: 'loan',
    label: STRINGS.common_loan,
  },
];

const DisclosureDetailsActionForm = ({ ref, disclosureData }: TProps) => {
  const { formState, setValue, handleSubmit, setFormState } = useForm({
    schema: createDisclosureDetailsSchema(),
    initalState: {
      home_condition_status: HOME_CONDITION_OPTIONS[1],
      home_status: HOME_STATUS_OPTIONS[1],
    },
  });

  useEffect(() => {
    if (disclosureData?.details) {
      setFormState(disclosureData?.details);
    }
  }, [disclosureData?.details, setFormState]);

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit]
  );

  return (
    <Stack gap={2}>
      <FormTextAreaInput
        label={STRINGS.patient_or_surgeries}
        name="patient_or_surgeries"
        value={formState.patient_or_surgeries}
        onChange={(v) => setValue({ patient_or_surgeries: v })}
      />

      <FormTextAreaInput
        label={STRINGS.job_or_school}
        name="job_or_school"
        value={formState.job_or_school}
        onChange={(v) => setValue({ job_or_school: v })}
      />
      <FieldSet label={STRINGS.home_status}>
        <Stack sx={{ gap: 2 }}>
          <Autocomplete
            options={HOME_STATUS_OPTIONS}
            value={formState.home_status}
            onChange={(_, newValue) =>
              setValue({
                home_status: newValue ?? HOME_STATUS_OPTIONS[1],
              })
            }
            getOptionLabel={(option) => (option ? option.label : '')}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label={STRINGS.home_status} variant="outlined" size="small" />
            )}
            clearOnEscape
            freeSolo={false}
          />
          <FormTextAreaInput
            placeholder={`${STRINGS.note} ${STRINGS.home_status_note}`}
            name="home_status_note"
            value={formState.home_status_note}
            onChange={(v) => setValue({ home_status_note: v })}
          />
        </Stack>
      </FieldSet>

      <FormTextAreaInput
        label={STRINGS.electricity}
        name="electricity"
        value={formState.electricity}
        onChange={(v) => setValue({ electricity: v })}
      />

      <FormTextAreaInput
        label={STRINGS.expenses}
        name="expenses"
        value={formState.expenses}
        onChange={(v) => setValue({ expenses: v })}
      />
      <FieldSet label={STRINGS.home_condition}>
        <Stack sx={{ gap: 2 }}>
          <Autocomplete
            options={HOME_CONDITION_OPTIONS}
            value={formState.home_condition_status}
            onChange={(_, newValue) =>
              setValue({
                home_condition_status: newValue ?? HOME_CONDITION_OPTIONS[1],
              })
            }
            getOptionLabel={(option) => (option ? option.label : '')}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label={STRINGS.home_condition} variant="outlined" size="small" />
            )}
            clearOnEscape
            freeSolo={false}
          />
          <FormTextAreaInput
            placeholder={`${STRINGS.note} ${STRINGS.home_condition}`}
            name="home_condition_note"
            value={formState.home_condition_note}
            onChange={(v) => setValue({ home_condition_note: v })}
          />
        </Stack>
      </FieldSet>

      <FormTextAreaInput
        label={STRINGS.pons}
        name="pons"
        value={formState.pons}
        onChange={(v) => setValue({ pons: v })}
      />

      <FormTextAreaInput
        label={STRINGS.cons}
        name="cons"
        value={formState.cons}
        onChange={(v) => setValue({ cons: v })}
      />
    </Stack>
  );
};

export default DisclosureDetailsActionForm;
