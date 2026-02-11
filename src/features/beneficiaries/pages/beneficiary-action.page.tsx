import STRINGS from '@/core/constants/strings.constant';
import { Card, Stack } from '@mui/material';
import type { TAddBeneficiaryDto } from '../types/beneficiary.types';
import { useRef, useState } from 'react';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import type { TBenefificaryFormHandlers } from '../components/beneficiary-action-form.component';
import BeneficiaryActionForm from '../components/beneficiary-action-form.component';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Header from '@/core/components/common/header/header';
import useBeneficiaryMutation from '../hooks/beneficiary-mutation.hook';
import { useBeneficiaryLoader } from '../hooks/use-beneficiary-loader.hook';
import beneficiaryApi from '../api/beneficiary.api';
import DisclosureActionForm, {
  type TDisclosureFormHandlers,
} from '@/features/disclosures/components/disclosure-action-form.component';
import useDisclosureMutation from '@/features/disclosures/hooks/disclosure-mutation.hook';
import type { TAddDisclosureDto } from '@/features/disclosures/types/disclosure.types';

const BeneficiaryActionPage = () => {
  const [searchParams] = useSearchParams();

  const beneficiaryId = searchParams.get('beneficiaryId');

  const ref = useRef<TBenefificaryFormHandlers | null>(null);
  const disclosureRef = useRef<TDisclosureFormHandlers | null>(null);

  const navigate = useNavigate();

  const [mutateBeneficiary, { isLoading: isMutating }] = useBeneficiaryMutation();
  const [mutateDisclosure, { isLoading: isMutatingDisclosure }] = useDisclosureMutation();

  const [validateNationalNumber, { isLoading: isValidatingNationalNumber }] =
    beneficiaryApi.useValidateNationalNumberMutation();

  const [validatePhoneNumbers, { isLoading: isValidatingPhoneNumbers }] =
    beneficiaryApi.useValidatePhoneNumbersMutation();

  const [validationErrors, setValidationErrors] = useState<{
    nationalNumber?: string;
    phoneNumbers?: string;
  }>({});

  const { data: beneficiaryData, isLoading: isGetting } = useBeneficiaryLoader({ id: beneficiaryId ?? '' });

  const showDisclosureForm = !beneficiaryId && !beneficiaryData && !isGetting;

  const isLoading =
    isMutating || isGetting || isValidatingNationalNumber || isValidatingPhoneNumbers || isMutatingDisclosure;

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid) return;

    let disclosureResult = null;
    if (showDisclosureForm) {
      disclosureResult = await disclosureRef.current!.handleSubmit();
      if (!disclosureResult.isValid) return;
    }

    const errors: typeof validationErrors = {};
    try {
      if (result.nationalNumber) {
        const { data } = await validateNationalNumber({
          nationalNumber: result.nationalNumber,
          patientId: beneficiaryId || undefined,
        });
        if (data?.existing) {
          errors.nationalNumber = `${STRINGS.already_exists_for_patient}: ${data.existing.name}`;
        }
      }
      if (result.phoneNumbers.length > 0) {
        const { data } = await validatePhoneNumbers({
          phoneNumbers: result.phoneNumbers,
          patientId: beneficiaryId || undefined,
        });
        if (data?.existing) {
          errors.phoneNumbers = `${STRINGS.phone_already_exists_for_patient}: ${data.existing?.patient.name}`;
        }
      }
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      setValidationErrors({});
      const addDto: TAddBeneficiaryDto = {
        name: result.name,
        nationalNumber: result.nationalNumber || null,
        areaId: result.area?.id || null,
        about: result.about || null,
        address: result.address || null,
        phoneNumbers: result.phoneNumbers,
        gender: (result.gender?.id as any) || null,
        job: result.job || null,
        birthDate: (result.birthDate || '')?.split('T')[0] || null,
      };
      let newBeneficiaryId: string | undefined;
      if (!beneficiaryId) {
        const response = await mutateBeneficiary({ type: 'INSERT', dto: addDto });
        newBeneficiaryId = (response as any)?.id;
        notifySuccess(STRINGS.added_successfully);
      } else {
        await mutateBeneficiary({
          type: 'UPDATE',
          dto: {
            ...addDto,
            id: beneficiaryId,
          },
        });
        notifySuccess(STRINGS.edited_successfully);
      }

      if (showDisclosureForm && disclosureResult && newBeneficiaryId) {
        const disclosureDto: TAddDisclosureDto = {
          type: disclosureResult.result.type!.id,
          patientId: newBeneficiaryId,
          priorityId: disclosureResult.result.priorityDegree!.id,
          scoutId: disclosureResult.result.employee?.id || null,
          initialNote: disclosureResult.result.initialNote || null,
        };
        await mutateDisclosure({ type: 'INSERT', dto: disclosureDto });
        notifySuccess(STRINGS.added_successfully);
      }
      navigate(-1);
    } catch (error: any) {
      notifyError(error);
    }
  };

  return (
    <Card>
      <Stack gap={2} sx={{ position: 'relative' }}>
        <Header title={beneficiaryId ? STRINGS.edit : STRINGS.add} />
        <BeneficiaryActionForm ref={ref} beneficiaryData={beneficiaryData} validationErrors={validationErrors} />
        {showDisclosureForm && (
          <>
            <Header title={STRINGS.add_disclosure} />
            <DisclosureActionForm ref={disclosureRef} beneficiaryAlreadyDefined={true} />
          </>
        )}
        <ActionFab icon={<Save />} color="success" onClick={handleSave} />
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryActionPage;
