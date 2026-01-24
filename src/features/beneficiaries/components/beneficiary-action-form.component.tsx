import FieldSet from '@/core/components/common/fieldset/fieldset.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import STRINGS from '@/core/constants/strings.constant';
import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import CitiesAutocomplete from '@/features/banks/components/cities/cities-autocomplete/cities-autocomplete.component';
import AreasAutocomplete from '@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component';
import type { TCity } from '@/features/banks/types/city.types';
import type { TArea } from '@/features/banks/types/work-areas.types';
import { Add, DeleteOutlined } from '@mui/icons-material';
import { Button, IconButton, Stack } from '@mui/material';
import z from 'zod';
import type {
  // TAddBeneficiaryDto,
  TBenefieciary,
  // TUpdateBeneficiaryDto,
} from '../types/beneficiary.types';
import { useEffect, useImperativeHandle, useState, type Ref } from 'react';
import citiesApi from '@/features/banks/api/cities-api/cities.api';
import { useAppDispatch } from '@/core/store/root.store.types';
import workAreasApi from '@/features/banks/api/work-areas/work-areas.api';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import type { TListItem } from '@/core/types/input.type';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import { addTimeZoneOffestToIsoDate } from '@/core/helpers/helpers';

const PatientFormSchema = z.object({
  name: z.string().min(5),
  nationalNumber: z.string().length(11),
  area: z.custom<TArea | null>((data) => !!data, {
    message: 'Area is required',
  }),
  address: z.string(),
  about: z.string().nullable(),
  city: z.custom<TCity | null>((data) => !!data, {
    message: 'City is required',
  }),
  phoneNumbers: z.array(z.string().length(10)).min(1),
  birthDate: z.string(),
  gender: z
    .custom<(TListItem & { label: string }) | null>((data) => !!data, {
      message: 'Gender is required',
    })
    .nullable(),
  job: z.string().nullable(),
});

export type TBenefificaryFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<typeof PatientFormSchema>>>;
};

type TProps = {
  ref: Ref<TBenefificaryFormHandlers>;
} & (
  | {
      beneficiaryData: TBenefieciary;
      // onSuccessSubmit: (dto: TUpdateBeneficiaryDto) => void;
    }
  | {
      beneficiaryData?: never;
      // onSuccessSubmit: (dto: TAddBeneficiaryDto) => void;
    }
);

function BeneficiaryActionForm({
  beneficiaryData,
  // onSuccessSubmit,
  ref,
}: TProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { formState, formErrors, handleSubmit, setFormState } = useForm({
    schema: PatientFormSchema,
    initalState: {
      name: '',
      nationalNumber: '',
      area: null,
      address: '',
      about: '',
      city: null,
      phoneNumbers: ['123'],
      birthDate: '',
      gender: null,
      job: '',
    },
  });

  const handleChange = (key: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };
  console.log(formErrors);

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
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (beneficiaryData) {
      setIsLoading(true);
      (async () => {
        let _city: TCity | null = null;
        let _area: TArea | null = null;
        let _gender: (TListItem & { label: string }) | null = null;

        const cities = await dispatch(citiesApi.endpoints.getCities.initiate({})).unwrap();
        const allCities = cities.pages.flatMap((page) => page.items);

        if (beneficiaryData.area) {
          const areas = await dispatch(
            workAreasApi.endpoints.getWorkAreas.initiate({
              cityId: beneficiaryData.area?.cityId,
              name: beneficiaryData.area.name,
            })
          ).unwrap();
          const allAreas = areas.pages.flatMap((page) => page.items);
          _area = allAreas.find((a) => a.id === beneficiaryData.area.id) ?? null;

          _city = allCities.find((c) => c.id === beneficiaryData.area.cityId) ?? null;
        }

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
          address: beneficiaryData.address,
          area: _area,
          city: _city,
          nationalNumber: beneficiaryData.nationalNumber,
          phoneNumbers: beneficiaryData.phones.map((p) => p.phone),
          birthDate: beneficiaryData.birthDate ?? '',
          job: beneficiaryData.job,
          gender: _gender,
        });
      })();
      setIsLoading(false);
    }
  }, [beneficiaryData, dispatch, setFormState]);

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
      <FormTextFieldInput
        required
        label={STRINGS.national_number}
        name="nationalNumber"
        value={formState.nationalNumber}
        onChange={(v) => handleChange('nationalNumber', v)}
        errorText={formErrors.nationalNumber?.[0].message ?? ''}
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
      <CitiesAutocomplete
        required
        label={STRINGS.city}
        value={formState.city}
        onChange={(v: TCity | null) => handleChange('city', v)}
        errorText={formErrors.city?.[0].message ?? ''}
      />
      <AreasAutocomplete
        multiple={false}
        required
        cityId={formState.city?.id}
        label={STRINGS.area}
        value={formState.area}
        onChange={(v) => handleChange('area', v)}
        errorText={formErrors.area?.[0].message ?? ''}
      />
      <FieldSet label={STRINGS.phone_numbers}>
        <Stack gap={2}>
          {formState.phoneNumbers.map((pn, index) => (
            <Stack direction="row" gap={1} alignItems="center">
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
                errorText={formErrors.phoneNumbers?.[index]?.message ?? ''}
                endAdornment={
                  <IconButton
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

      {/* <FormTextFieldInput
        label={STRINGS.job_or_school}
        name="address"
        value={formState.job ?? ""}
        onChange={(v) => handleChange("job", v)}
      /> */}

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
      {/*  <Button onClick={() => handleSave()}>
        {beneficiaryData ? STRINGS.save : STRINGS.add}
      </Button> */}
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
}

export default BeneficiaryActionForm;
