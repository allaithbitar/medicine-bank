import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import { Stack } from '@mui/material';
import z from 'zod';
import { type TDisclosure, type TDisclosureType } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import EmployeesAutocomplete from '@/features/employees/components/employees-autocomplete.component';
import PriorityDegreesAutocomplete from '@/features/priority-degres/components/priority-degees-autocomplete.component';
import type { TPriorityDegree } from '@/features/priority-degres/types/priority-degree.types';
import { useCallback, useEffect, useImperativeHandle, type Ref } from 'react';
import BeneficiariesAutocomplete from '@/features/beneficiaries/components/beneficiaries-autocomplete.component';
import type { TAutocompleteItem } from '@/core/types/common.types';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import DisclosureTypeAutocomplete from './disclosure-type-autocomplete.component';
import useScoutRecommendation from '../hooks/use-scout-recommendation.hook';

const createDisclosureSchema = (beneficiaryAlreadyDefined = false) =>
  z
    .object({
      type: z.custom<{ id: TDisclosureType; label: string } | null>((data) => !!data, {
        message: STRINGS.schema_required,
      }),
      employee: z.custom<TAutocompleteItem | null>(),
      beneficiary: z.custom<TAutocompleteItem | null>(),
      priorityDegree: z.custom<TPriorityDegree | null>((data) => !!data, {
        message: STRINGS.schema_required,
      }),
      initialNote: z.string(),
    })
    .superRefine((state, ctx) => {
      if (!beneficiaryAlreadyDefined && !state.beneficiary) {
        ctx.addIssue({
          code: 'custom',
          message: STRINGS.schema_required,
          path: ['beneficiary'],
        });
      }
    });

export type TDisclosureFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<ReturnType<typeof createDisclosureSchema>>>>;
};

type TProps = {
  ref: Ref<TDisclosureFormHandlers>;
  disclosureData?: TDisclosure;
  beneficiaryAlreadyDefined?: boolean;
};

const DisclosureActionForm = ({ ref, disclosureData, beneficiaryAlreadyDefined }: TProps) => {
  const { formState, formErrors, setValue, handleSubmit, setFormState } = useForm({
    schema: createDisclosureSchema(beneficiaryAlreadyDefined),
    initalState: {
      type: null as any,
      priorityDegree: null,
      employee: null,
      beneficiary: null,
      initialNote: '',
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit]
  );

  const handleScoutRecommendation = useCallback(
    (scout: TAutocompleteItem) => {
      setValue({ employee: scout });
    },
    [setValue]
  );

  const { isLoading: isLoadingRecommendation } = useScoutRecommendation({
    beneficiaryId: formState.beneficiary?.id,
    currentScout: formState.employee,
    onRecommendationFound: handleScoutRecommendation,
  });

  useEffect(() => {
    if (disclosureData) {
      setFormState({
        type: {
          id: disclosureData.type,
          label: STRINGS[disclosureData.type],
        },
        employee: disclosureData.scout
          ? {
              id: disclosureData.scout?.id,
              name: disclosureData.scout.name,
            }
          : null,
        beneficiary: disclosureData.patient
          ? {
              id: disclosureData.patient?.id,
              name: disclosureData.patient.name,
            }
          : null,
        priorityDegree: disclosureData.priority,
        initialNote: disclosureData.initialNote ?? '',
      });
    }
  }, [disclosureData, setFormState]);

  return (
    <Stack gap={2}>
      <DisclosureTypeAutocomplete
        required
        multiple={false}
        value={formState.type}
        onChange={(type) => setValue({ type })}
        errorText={formErrors.type?.[0].message}
      />

      <PriorityDegreesAutocomplete
        required
        multiple={false}
        value={formState.priorityDegree}
        onChange={(v) => setValue({ priorityDegree: v })}
        errorText={formErrors.priorityDegree?.[0].message}
      />

      {!beneficiaryAlreadyDefined && (
        <BeneficiariesAutocomplete
          disabled={!!disclosureData}
          required
          multiple={false}
          value={formState.beneficiary}
          onChange={(v) => setValue({ beneficiary: v })}
          errorText={formErrors.beneficiary?.[0].message}
        />
      )}
      <EmployeesAutocomplete
        roles={['scout']}
        label={STRINGS.disclosure_scout}
        multiple={false}
        value={formState.employee}
        onChange={(v) => setValue({ employee: v })}
        errorText={formErrors.employee?.[0].message}
        helperText={isLoadingRecommendation ? STRINGS.loading_recommendation : ''}
      />
      <FormTextAreaInput
        label={STRINGS.initial_note}
        value={formState.initialNote}
        onChange={(v) => setValue({ initialNote: v })}
        errorText={formErrors.initialNote?.[0].message}
      />
    </Stack>
  );
};

export default DisclosureActionForm;
