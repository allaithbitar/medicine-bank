import { useEffect } from 'react';
import { Card, Stack } from '@mui/material';
import { z } from 'zod';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';

import { getErrorMessage, getStringsLabel } from '@/core/helpers/helpers';
import type { TAddFamilyMemberPayload, TGender, TKinship } from '../types/beneficiary.types';
import beneficiaryApi from '../api/beneficiary.api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import useForm from '@/core/hooks/use-form.hook';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import FormSelectInput from '@/core/components/common/inputs/form-select-input.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FormNumberInput from '@/core/components/common/inputs/form-number-input.component';

const FamilyMemberSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(200),
  birthDate: z.string().min(1, { message: 'Birth date is required' }),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  kinshep: z.enum(['partner', 'child', 'parent', 'brother', 'grandparent', 'grandchild'], {
    errorMap: () => ({ message: 'Kinshep is required' }),
  }),
  jobOrSchool: z.string(),
  residential: z.string(),
  note: z.string().optional(),
  nationalNumber: z.string(),
  kidsCount: z.string(),
});

const GENDERS: TGender[] = ['male', 'female'];
const KINSHEP: TKinship[] = ['partner', 'child', 'parent', 'brother', 'grandparent', 'grandchild'];

const BeneficiaryFamilyActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('id') ?? undefined;
  const { id: patientId } = useParams();

  const { data: familyMemberData, isLoading: isFetchingFamilyMemberData } = beneficiaryApi.useGetFamilyMemberByIdQuery(
    {
      id: memberId!,
    },
    { skip: !memberId }
  );
  const [addFamilyMember, { isLoading: isAdding }] = beneficiaryApi.useAddFamilyMemberMutation();
  const [updateFamilyMember, { isLoading: isUpdating }] = beneficiaryApi.useUpdateFamilyMemberMutation();

  const { formState, formErrors, setValue, handleSubmit } = useForm({
    schema: FamilyMemberSchema,
    initalState: {
      birthDate: '',
      gender: 'male',
      kinshep: 'partner',
      name: '',
      jobOrSchool: '',
      note: '',
      residential: '',
      kidsCount: '',
      nationalNumber: '',
    },
  });

  const handleSubmitForm = async () => {
    const { isValid, result } = await handleSubmit();
    if (!isValid) return;
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
        await updateFamilyMember({ ...dto, id: memberId }).unwrap();
      } else {
        await addFamilyMember(dto).unwrap();
      }

      notifySuccess(memberId ? STRINGS.edited_successfully : STRINGS.added_successfully);
      navigate(-1);
    } catch (err: any) {
      notifyError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    if (familyMemberData) {
      setValue({
        name: familyMemberData.name,
        birthDate: familyMemberData.birthDate,
        gender: familyMemberData.gender,
        jobOrSchool: familyMemberData.jobOrSchool ?? '',
        kinshep: familyMemberData.kinshep,
        note: familyMemberData.note ?? '',
        residential: familyMemberData.residential ?? '',
      });
    }
  }, [familyMemberData, setValue]);

  const isLoading = isAdding || isUpdating || isFetchingFamilyMemberData;
  console.log({ formState });

  return (
    <Card>
      <Stack gap={2}>
        <FormTextFieldInput
          required
          label={STRINGS.name}
          value={formState.name}
          onChange={(v) => setValue({ name: v })}
          errorText={formErrors.name?.[0].message}
        />

        <FormDateInput
          format="yyyy"
          views={['year']}
          required
          disableFuture
          label={STRINGS.birth_date}
          value={formState.birthDate}
          onChange={(newDate) => {
            setValue({ birthDate: newDate });
          }}
          errorText={formErrors.birthDate?.[0].message}
        />
        <FormTextFieldInput
          label={STRINGS.national_number}
          value={formState.nationalNumber}
          onChange={(v) => setValue({ nationalNumber: v })}
          errorText={formErrors.nationalNumber?.[0].message}
        />

        <Stack sx={{ flexDirection: 'row', gap: 2 }}>
          <FormSelectInput
            value={formState.gender}
            required
            disableClearable
            label={STRINGS.gender}
            options={GENDERS.map((g) => ({ id: g, label: STRINGS[g] }))}
            onChange={(v) => setValue({ gender: v as any })}
            getOptionLabel={(option) => option.label}
            errorText={formErrors.gender?.[0].message}
          />
          <FormSelectInput
            value={formState.kinshep}
            required
            disableClearable
            label={STRINGS.kinship}
            options={KINSHEP.map((k) => ({ id: k, label: getStringsLabel({ key: 'kinship', val: k }) }))}
            onChange={(v) => setValue({ kinshep: v as any })}
            getOptionLabel={(option) => option.label}
            errorText={formErrors.gender?.[0].message}
          />
          <FormNumberInput
            value={formState.kidsCount}
            required
            label={STRINGS.kids_count}
            onChange={(v) => setValue({ kidsCount: String(v) })}
            errorText={formErrors.gender?.[0].message}
          />
        </Stack>
        <FormTextFieldInput
          label={STRINGS.job_or_school}
          value={formState.jobOrSchool}
          onChange={(v) => setValue({ jobOrSchool: v })}
          errorText={formErrors.name?.[0].message}
        />

        <FormTextFieldInput
          label={STRINGS.residential}
          value={formState.residential}
          onChange={(v) => setValue({ residential: v })}
          errorText={formErrors.residential?.[0].message}
        />

        <FormTextAreaInput
          label={STRINGS.note}
          value={formState.note}
          onChange={(v) => setValue({ note: v })}
          errorText={formErrors.note?.[0].message}
        />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSubmitForm} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryFamilyActionPage;
