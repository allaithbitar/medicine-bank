import { useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import { Card } from '@mui/material';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Header from '@/core/components/common/header/header';
import useDisclosureSubPatientMutation from '../hooks/disclosure-sub-patient.mutation.hook';
import { useDisclosureSubPatientLoader } from '../hooks/disclosure-sub-patient-loader.hook';
import DisclosureSubPatientActionForm, {
  type TSubPatientFormHandlers,
} from '../components/disclosure-sub-patient-action-form.component';
import { getErrorMessage } from '@/core/helpers/helpers';

const DisclosureSubPatientActionPage = () => {
  const { disclosureId } = useParams<{ disclosureId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const { data: subPatientData, isLoading: isLoadingById } = useDisclosureSubPatientLoader(id);
  const formRef = useRef<TSubPatientFormHandlers>(null);
  const [mutateSubPatient, { isLoading: isMutating }] = useDisclosureSubPatientMutation();

  const handleSave = async () => {
    if (!disclosureId) return;
    try {
      const result = await formRef.current?.handleSubmit();
      if (!result?.isValid) return;
      const values = result.result;
      if (values.gender) {
        values.gender = values.gender.id;
      } else {
        values.gender = null;
      }
      if (values.birthDate && values.birthDate.trim() !== '') {
        values.birthDate = values.birthDate.split('T')[0];
      } else {
        values.birthDate = null;
      }
      if (id) {
        await mutateSubPatient({ type: 'UPDATE', dto: { ...values, id, disclosureId } });
        notifySuccess(STRINGS.edited_successfully);
      } else {
        await mutateSubPatient({ type: 'INSERT', dto: { ...values, disclosureId } });
        notifySuccess(STRINGS.added_successfully);
      }
      navigate(-1);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Header title={id ? STRINGS.edit_sub_patient : STRINGS.add_sub_patient} showBackButton />
      <DisclosureSubPatientActionForm subPatientData={subPatientData} formRef={formRef} />
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isMutating} />
      {(isMutating || isLoadingById) && <LoadingOverlay />}
    </Card>
  );
};

export default DisclosureSubPatientActionPage;
