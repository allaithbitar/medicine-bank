import { Box, Button, Card, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import useDisclosureSubPatientMutation from '../hooks/disclosure-sub-patient.mutation.hook';
import { useDisclosureSubPatientsLoader } from '../hooks/disclosure-sub-patients-loader.hook';
import { useDisclosureSubPatientLoader } from '../hooks/disclosure-sub-patient-loader.hook';
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import STRINGS from '@/core/constants/strings.constant';
import z from 'zod';
import type { TListItem } from '@/core/types/input.type';
import useForm from '@/core/hooks/use-form.hook';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FieldSet from '@/core/components/common/fieldset/fieldset.component';
import { Add, DeleteOutlined, ExpandMore } from '@mui/icons-material';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import { addTimeZoneOffestToIsoDate } from '@/core/helpers/helpers';
import type { TDisclosureSubPatient } from '../types/disclosure.types';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';

const FormSchema = z.object({
  name: z.string().min(5, STRINGS.schema_name_too_short),
  nationalNumber: z.string(),
  about: z.string().nullable(),
  phones: z.array(z.string().length(10, STRINGS.schema_phone_digits)),
  birthDate: z.string(),
  gender: z
    .custom<(TListItem & { label: string }) | null>((data) => !!data, {
      message: STRINGS.schema_required,
    })
    .nullable(),
  job: z.string().nullable(),
});

export type TSubPatientFormHandlers = {
  handleSubmit: () => Promise<any>;
};

const Form = ({
  subPatientData,
  ref,
}: {
  subPatientData?: TDisclosureSubPatient;
  ref: Ref<TSubPatientFormHandlers>;
}) => {
  const [showOptionalFields, setShowOptionalFields] = useState(subPatientData ? true : false);
  const { formState, formErrors, handleSubmit, setFormState } = useForm({
    schema: FormSchema,
    initalState: {
      name: '',
      nationalNumber: '',
      about: '',
      phones: [''],
      birthDate: '',
      gender: null,
      job: '',
    },
  });

  const handleChange = (key: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit]
  );

  useEffect(() => {
    if (subPatientData) {
      let _gender: (TListItem & { label: string }) | null = null;
      if (subPatientData.gender) {
        if (subPatientData.gender === 'male') {
          _gender = { id: 'male', label: STRINGS.male };
        } else {
          _gender = { id: 'female', label: STRINGS.female };
        }
      }
      setFormState({
        name: subPatientData.name,
        about: subPatientData.about,
        nationalNumber: subPatientData.nationalNumber || '',
        phones: subPatientData.phones ?? [],
        birthDate: subPatientData.birthDate ?? '',
        job: subPatientData.job,
        gender: _gender,
      });
    }
  }, [setFormState, subPatientData]);

  return (
    <Card>
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
          label={STRINGS.national_number}
          name="nationalNumber"
          value={formState.nationalNumber}
          onChange={(v) => handleChange('nationalNumber', v)}
          errorText={formErrors.nationalNumber?.[0].message}
        />

        <FieldSet label={STRINGS.phone_numbers}>
          <Stack gap={2}>
            {formState.phones.map((pn, index) => (
              <Stack key={index} direction="row" gap={1} alignItems="center">
                <FormTextFieldInput
                  label={`${STRINGS.phone_number} ${index + 1}`}
                  value={pn}
                  onChange={(v) => {
                    const sanitizedValue = v.replace(/\s+/g, '');
                    const clone = structuredClone(formState.phones);
                    clone[index] = sanitizedValue;
                    return setFormState((prev) => ({
                      ...prev,
                      phones: clone,
                    }));
                  }}
                  errorText={formErrors.phones?.[index]?.message}
                  endAdornment={
                    <IconButton
                      disabled={formState.phones.length === 1}
                      color="error"
                      onClick={() => {
                        const clone = structuredClone(formState.phones);
                        clone.splice(index, 1);
                        setFormState((prev) => ({
                          ...prev,
                          phones: clone,
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
                  phones: [...prev.phones, ''],
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
    </Card>
  );
};

const DisclosureSubPateints = ({ disclosureId }: { disclosureId: string }) => {
  const formRef = useRef<TSubPatientFormHandlers>(null);
  const [selectedId, setSelectedId] = useState('');
  const { data } = useDisclosureSubPatientsLoader(disclosureId);

  const { data: selectedSubPatientData } = useDisclosureSubPatientLoader(selectedId);
  const [mutateSubPatient, { isLoading: isMutating }] = useDisclosureSubPatientMutation();

  const handleSave = async () => {
    try {
      const result = await formRef.current?.handleSubmit();
      console.log({ result });
      if (!result.isValid) return;

      const values = result.result;

      if (values.gender) {
        values.gender = values.gender.id;
      }

      if (values.birthDate) {
        values.birthDate = values.birthDate?.split('T')[0] || null;
      }
      if (selectedSubPatientData) {
        await mutateSubPatient({ type: 'UPDATE', dto: { ...values, id: selectedSubPatientData.id, disclosureId } });
      } else {
        await mutateSubPatient({ type: 'INSERT', dto: { ...values, disclosureId } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack sx={{ position: 'relative' }}>
      {data?.map((d) => (
        <Card key={d.id} onClick={() => setSelectedId(d.id)}>
          {JSON.stringify(d)}
        </Card>
      ))}
      {selectedSubPatientData && (
        <>
          <Divider />
          <Card>{JSON.stringify(selectedSubPatientData)}</Card>
        </>
      )}
      <Form ref={formRef} subPatientData={selectedSubPatientData} />
      <Button onClick={() => handleSave()}>save</Button>
      {isMutating && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureSubPateints;
