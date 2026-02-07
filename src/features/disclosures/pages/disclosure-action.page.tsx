import { Card } from '@mui/material';
import DisclosureActionForm, { type TDisclosureFormHandlers } from '../components/disclosure-action-form.component';
import { useRef } from 'react';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import type { TAddDisclosureDto } from '../types/disclosure.types';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Header from '@/core/components/common/header/header';
import useDisclosureMutation from '../hooks/disclosure-mutation.hook';
import { useDisclosureLoader } from '../hooks/disclosure-loader.hook';

const DisclosureActionPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const beneficiaryId = searchParams.get('beneficiaryId');

  const disclosureId = searchParams.get('disclosureId');

  const { data: disclosureData, isFetching: isGetting } = useDisclosureLoader({ id: disclosureId! });

  const [mutateDisclosure, { isLoading: isMutating }] = useDisclosureMutation();

  // const [addDisclosure, { isLoading: isAdding }] = disclosuresApi.useAddDisclosureMutation();
  //
  // const [updateDisclosure, { isLoading: isUpdating }] = disclosuresApi.useUpdateDisclosureMutation();

  const ref = useRef<TDisclosureFormHandlers | null>(null);

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid) return;

    try {
      const addDto: TAddDisclosureDto = {
        type: result.type!.id,
        patientId: beneficiaryId ?? result.beneficiary!.id,
        priorityId: result.priorityDegree!.id,
        scoutId: result.employee?.id || null,
        initialNote: result.initialNote || null,
      };

      if (!disclosureId) {
        await mutateDisclosure({ type: 'INSERT', dto: addDto });
        notifySuccess(STRINGS.added_successfully);
        navigate('/disclosures');
      } else {
        await mutateDisclosure({ type: 'UPDATE', dto: { ...addDto, id: disclosureId } });
        notifySuccess(STRINGS.edited_successfully);
        navigate(`/disclosures/${disclosureId}`);
        // const { error } = await updateDisclosure({
        //   ...addDto,
        //   id: disclosureId,
        // });
        //
        // if (error) {
        //   notifyError(error);
        // } else {
        //   navigate(`/disclosures/${disclosureId}`);
        // }
      }
      navigate('/disclosures');
    } catch (error: any) {
      notifyError(error);
    }
  };
  const isLoading = isMutating || isGetting;

  return (
    <Card>
      <Header title={disclosureId ? STRINGS.edit : STRINGS.add} />
      <DisclosureActionForm ref={ref} beneficiaryAlreadyDefined={!!beneficiaryId} disclosureData={disclosureData} />
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default DisclosureActionPage;
