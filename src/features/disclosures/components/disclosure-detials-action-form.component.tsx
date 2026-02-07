import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import { Stack, Autocomplete, TextField } from '@mui/material';
import z from 'zod';
import type { TDisclosureDetails } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import { useEffect, useImperativeHandle, type Ref } from 'react';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FieldSet from '@/core/components/common/fieldset/fieldset.component';

const OptionSchema = z
  .object({
    id: z.string(),
    label: z.string(),
  })
  .optional();

const createDisclosureDetailsSchema = () =>
  z.object({
    jobOrSchool: z.string().optional(),
    diseasesOrSurgeries: z.string().optional(),
    expenses: z.string().optional(),
    houseCondition: OptionSchema,
    houseConditionNote: z.string().optional(),
    houseOwnership: OptionSchema,
    houseOwnershipNote: z.string().optional(),
    electricity: z.string().optional(),
    pros: z.string().optional(),
    cons: z.string().optional(),
    other: z.string().optional(),
  });

export type TDisclosureDetailsFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<ReturnType<typeof createDisclosureDetailsSchema>>>>;
};

type TProps = {
  ref: Ref<TDisclosureDetailsFormHandlers>;
  disclosureDetails?: TDisclosureDetails | null;
};

const HOUSE_CONDITION_OPTIONS = [
  {
    id: 'very_good',
    label: STRINGS.house_condition_very_good,
  },
  {
    id: 'good',
    label: STRINGS.house_condition_good,
  },
  {
    id: 'medium',
    label: STRINGS.house_condition_medium,
  },
  {
    id: 'bad',
    label: STRINGS.house_condition_bad,
  },
  {
    id: 'very_bad',
    label: STRINGS.house_condition_very_bad,
  },
  {
    id: 'not_working',
    label: STRINGS.house_condition_not_working,
  },
];

const HOUSE_OWNERSHIP_OPTIONS = [
  {
    id: 'owned',
    label: STRINGS.house_ownership_owned,
  },
  {
    id: 'rent',
    label: STRINGS.house_ownership_rent,
  },
  {
    id: 'loan',
    label: STRINGS.house_ownership_loan,
  },
  {
    id: 'mortage',
    label: STRINGS.house_ownership_mortage,
  },
];

const DisclosureDetailsActionForm = ({ ref, disclosureDetails }: TProps) => {
  const { formState, setValue, handleSubmit, setFormState } = useForm({
    schema: createDisclosureDetailsSchema(),
    initalState: {
      houseCondition: HOUSE_CONDITION_OPTIONS[2],
      houseOwnership: HOUSE_OWNERSHIP_OPTIONS[0],
    },
  });

  useEffect(() => {
    if (disclosureDetails) {
      const mappedState: any = {
        jobOrSchool: disclosureDetails.jobOrSchool || '',
        diseasesOrSurgeries: disclosureDetails.diseasesOrSurgeries || '',
        expenses: disclosureDetails.expenses || '',
        electricity: disclosureDetails.electricity || '',
        pros: disclosureDetails.pros || '',
        cons: disclosureDetails.cons || '',
        other: disclosureDetails.other || '',
        houseConditionNote: disclosureDetails.houseConditionNote || '',
        houseOwnershipNote: disclosureDetails.houseOwnershipNote || '',
      };

      if (disclosureDetails.houseCondition) {
        mappedState.houseCondition = HOUSE_CONDITION_OPTIONS.find((opt) => opt.id === disclosureDetails.houseCondition);
      }

      if (disclosureDetails.houseOwnership) {
        mappedState.houseOwnership = HOUSE_OWNERSHIP_OPTIONS.find((opt) => opt.id === disclosureDetails.houseOwnership);
      }

      setFormState(mappedState);
    }
  }, [disclosureDetails, setFormState]);

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
        label={STRINGS.diseases_or_surgeries}
        name="diseasesOrSurgeries"
        value={formState.diseasesOrSurgeries}
        onChange={(v) => setValue({ diseasesOrSurgeries: v })}
      />

      <FormTextAreaInput
        label={STRINGS.job_or_school}
        name="jobOrSchool"
        value={formState.jobOrSchool}
        onChange={(v) => setValue({ jobOrSchool: v })}
      />

      <FieldSet label={STRINGS.house_ownership}>
        <Stack sx={{ gap: 2 }}>
          <Autocomplete
            options={HOUSE_OWNERSHIP_OPTIONS}
            value={formState.houseOwnership}
            onChange={(_, newValue) =>
              setValue({
                houseOwnership: newValue ?? HOUSE_OWNERSHIP_OPTIONS[0],
              })
            }
            getOptionLabel={(option) => (option ? option.label : '')}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label={STRINGS.house_ownership} variant="outlined" size="small" />
            )}
            clearOnEscape
            freeSolo={false}
          />
          <FormTextAreaInput
            placeholder={STRINGS.note}
            name="houseOwnershipNote"
            value={formState.houseOwnershipNote}
            onChange={(v) => setValue({ houseOwnershipNote: v })}
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
            options={HOUSE_CONDITION_OPTIONS}
            value={formState.houseCondition}
            onChange={(_, newValue) =>
              setValue({
                houseCondition: newValue ?? HOUSE_CONDITION_OPTIONS[2],
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
            placeholder={STRINGS.note}
            name="houseConditionNote"
            value={formState.houseConditionNote}
            onChange={(v) => setValue({ houseConditionNote: v })}
          />
        </Stack>
      </FieldSet>

      <FormTextAreaInput
        label={STRINGS.pons}
        name="pros"
        value={formState.pros}
        onChange={(v) => setValue({ pros: v })}
      />

      <FormTextAreaInput
        label={STRINGS.cons}
        name="cons"
        value={formState.cons}
        onChange={(v) => setValue({ cons: v })}
      />

      <FormTextAreaInput
        label={STRINGS.other_details}
        name="other"
        value={formState.other}
        onChange={(v) => setValue({ other: v })}
      />
    </Stack>
  );
};

export default DisclosureDetailsActionForm;
