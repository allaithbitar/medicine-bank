import FieldSet from '@/core/components/common/fieldset/fieldset.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import STRINGS from '@/core/constants/strings.constant';
import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import CitiesAutocomplete from '@/features/banks/components/cities/cities-autocomplete/cities-autocomplete.component';
import AreasAutocomplete from '@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component';
import type { TCity } from '@/features/banks/types/city.types';
import { Add, DeleteOutlined, ExpandMore } from '@mui/icons-material';
import { Button, IconButton, Stack, Collapse, Box, Typography } from '@mui/material';
import z from 'zod';
import type { TBenefieciary } from '../types/beneficiary.types';
import { useEffect, useImperativeHandle, useState, type Ref } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import type { TListItem } from '@/core/types/input.type';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import { addTimeZoneOffestToIsoDate } from '@/core/helpers/helpers';
import type { TAutocompleteItem } from '@/core/types/common.types';

const PatientFormSchema = z.object({
  name: z.string().min(5, STRINGS.schema_name_too_short),
  nationalNumber: z.string().optional(),
  area: z.custom<TAutocompleteItem | null>((data) => !!data, {
    message: STRINGS.schema_required,
  }),
  address: z.string(),
  about: z.string().nullable(),
  city: z.custom<TAutocompleteItem | null>((data) => !!data, {
    message: STRINGS.schema_required,
  }),
  phoneNumbers: z.array(z.string().length(10, STRINGS.schema_phone_digits)).min(1, STRINGS.schema_at_least_one_phone),
  birthDate: z.string(),
  gender: z
    .custom<(TListItem & { label: string }) | null>((data) => !!data, {
      message: STRINGS.schema_required,
    })
    .nullable(),
  job: z.string().nullable(),
});

export type TBenefificaryFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<typeof PatientFormSchema>>>;
};

type TProps = {
  ref: Ref<TBenefificaryFormHandlers>;
  validationErrors?: {
    nationalNumber?: string;
    phoneNumbers?: string;
  };
} & (
  | {
      beneficiaryData: TBenefieciary;
    }
  | {
      beneficiaryData?: never;
    }
);

function BeneficiaryActionForm({ beneficiaryData, ref, validationErrors }: TProps) {
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const { formState, formErrors, handleSubmit, setFormState } = useForm({
    schema: PatientFormSchema,
    initalState: {
      name: '',
      nationalNumber: '',
      area: null,
      address: '',
      about: '',
      city: null,
      phoneNumbers: [''],
      birthDate: '',
      gender: null,
      job: '',
    },
  });

  const handleChange = (key: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  // const handleSave = async () => {
  //   const { isValid, result } = await handleSubmit();
  //   if (!isValid) return;
  //
  //   const addDto: TAddBeneficiaryDto = {
  //     name: result.name,
  //     nationalNumber: result.nationalNumber,
  //     areaId: result.area?.id,
  //     about: result.about,
  //     address: result.address,
  //     phoneNumbers: result.phoneNumbers,
  //   };
  //
  //   if (beneficiaryData) {
  //     onSuccessSubmit({ ...addDto, id: beneficiaryData.id });
  //   } else {
  //     onSuccessSubmit(addDto);
  //   }
  //
  //   // const { error: addError } = await addPatient({
  //   //   name: result.name,
  //   //   nationalNumber: result.nationalNumber,
  //   //   phoneNumbers: result.phoneNumbers,
  //   //   about: result.about,
  //   //   address: result.address,
  //   //   areaId: result.area?.id,
  //   // });
  //   // if (addError) {
  //   //   notifyError(getErrorMessage(addError));
  //   // } else {
  //   //   notifySuccess(STRINGS.added_successfully);
  //   // }
  // };

  useEffect(() => {
    if (beneficiaryData) {
      let _gender: (TListItem & { label: string }) | null = null;
      if (beneficiaryData.gender) {
        if (beneficiaryData.gender === 'male') {
          _gender = { id: 'male', label: STRINGS.male };
        } else {
          _gender = { id: 'female', label: STRINGS.female };
        }
      }
      setFormState({
        name: beneficiaryData.name,
        about: beneficiaryData.about,
        address: beneficiaryData.address || '',
        area: null,
        city: null,
        nationalNumber: beneficiaryData.nationalNumber || '',
        phoneNumbers: beneficiaryData.phones.map((p) => p.phone),
        birthDate: beneficiaryData.birthDate ?? '',
        job: beneficiaryData.job,
        gender: _gender,
      });
    }
  }, [beneficiaryData, setFormState]);

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
      <FormTextFieldInput
        required
        label={STRINGS.name}
        name="name"
        value={formState.name}
        onChange={(v) => handleChange('name', v)}
        errorText={formErrors.name?.[0].message ?? ''}
      />
      <CitiesAutocomplete
        required
        label={STRINGS.city}
        defaultValueId={beneficiaryData?.area?.cityId}
        value={formState.city}
        onChange={(v: TCity | null) => handleChange('city', v)}
        errorText={formErrors.city?.[0].message ?? ''}
      />
      <AreasAutocomplete
        multiple={false}
        required
        cityId={formState.city?.id}
        defaultValueId={beneficiaryData?.area?.id}
        label={STRINGS.area}
        value={formState.area}
        onChange={(v) => handleChange('area', v)}
        errorText={formErrors.area?.[0].message ?? ''}
      />
      <FieldSet label={STRINGS.phone_numbers}>
        <Stack gap={2}>
          {formState.phoneNumbers.map((pn, index) => (
            <Stack key={index} direction="row" gap={1} alignItems="center">
              <FormTextFieldInput
                label={`${STRINGS.phone_number} ${index + 1}`}
                value={pn}
                onChange={(v) => {
                  const clone = structuredClone(formState.phoneNumbers);
                  clone[index] = v;
                  return setFormState((prev) => ({
                    ...prev,
                    phoneNumbers: clone,
                  }));
                }}
                errorText={formErrors.phoneNumbers?.[index]?.message || validationErrors?.phoneNumbers}
                endAdornment={
                  <IconButton
                    disabled={formState.phoneNumbers.length === 1}
                    color="error"
                    onClick={() => {
                      const clone = structuredClone(formState.phoneNumbers);
                      clone.splice(index, 1);
                      setFormState((prev) => ({
                        ...prev,
                        phoneNumbers: clone,
                      }));
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                }
              />
            </Stack>
          ))}

          <Button
            startIcon={<Add />}
            onClick={() =>
              setFormState((prev) => ({
                ...prev,
                phoneNumbers: [...prev.phoneNumbers, ''],
              }))
            }
          >
            {STRINGS.add}
          </Button>
        </Stack>
      </FieldSet>
      <Box>
        <Button
          onClick={() => setShowOptionalFields(!showOptionalFields)}
          endIcon={
            <ExpandMore
              sx={{
                transform: showOptionalFields ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: '0.3s',
              }}
            />
          }
          sx={{ mb: 1 }}
        >
          <Typography>{showOptionalFields ? STRINGS.show_less : STRINGS.show_more}</Typography>
          <Typography sx={{ mx: 1 }}>({STRINGS.additional_information})</Typography>
        </Button>
        <Collapse in={showOptionalFields}>
          <Stack gap={2}>
            <FormTextFieldInput
              label={STRINGS.national_number}
              name="nationalNumber"
              value={formState.nationalNumber}
              onChange={(v) => handleChange('nationalNumber', v)}
              errorText={validationErrors?.nationalNumber || formErrors.nationalNumber?.[0].message || ''}
            />
            <FormAutocompleteInput<{ id: string; label: string }>
              value={formState.gender}
              label={STRINGS.gender}
              options={[
                { id: 'male', label: STRINGS.male },
                { id: 'female', label: STRINGS.female },
              ]}
              onChange={(v) => handleChange('gender', v)}
            />
            <FormDateInput
              label={STRINGS.birth_date}
              value={formState.birthDate ?? ''}
              onChange={(v) => handleChange('birthDate', v ? addTimeZoneOffestToIsoDate(v).toISOString() : '')}
            />
            <FormTextFieldInput
              label={STRINGS.job_or_school}
              name="job"
              value={formState.job ?? ''}
              onChange={(v) => handleChange('job', v)}
            />
            <FormTextFieldInput
              label={STRINGS.patient_address}
              name="address"
              value={formState.address}
              onChange={(v) => handleChange('address', v)}
            />
            <FormTextAreaInput
              label={STRINGS.patient_about}
              name="about"
              value={formState.about ?? ''}
              onChange={(v) => handleChange('about', v)}
            />
          </Stack>
        </Collapse>
      </Box>
    </Stack>
  );
}

export default BeneficiaryActionForm;
