import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { Save } from '@mui/icons-material';
import { Card } from '@mui/material';
import { useRef } from 'react';
import DisclosureDetailsActionForm, {
  type TDisclosureDetailsFormHandlers,
} from '../components/disclosure-detials-action-form.component';
import { useNavigate, useSearchParams } from 'react-router-dom';
import STRINGS from '@/core/constants/strings.constant';
import Header from '@/core/components/common/header/header';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
// import type { THouseHoldAssetCondition, THouseOwnership } from '@/libs/kysely/schema';
import useDisclosureDetailsMutation from '../hooks/disclosure-details-mutation.hook';
import { useDisclosureDetailsLoader } from '../hooks/disclosure-details-loader.hook';

function DisclosureDetailsActionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = useRef<TDisclosureDetailsFormHandlers | null>(null);
  const disclosureId = searchParams.get('disclosureId');

  const { data: disclosureDetails, isFetching: isGetting } = useDisclosureDetailsLoader(disclosureId ?? '');

  const [mutateDisclosureDetails, { isLoading: isMutatingDisclosureDetails }] = useDisclosureDetailsMutation();

  // const [addDisclosureDetails, { isLoading: isAdding }] = disclosuresApi.useAddDisclosureDetailsMutation();
  // const [updateDisclosureDetails, { isLoading: isUpdating }] = disclosuresApi.useUpdateDisclosureDetailsMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    const audioFile = ref.current?.getAudioFile?.();

    console.log({ isValid, result, audioFile });

    if (!isValid || !disclosureId) return;

    try {
      if (disclosureDetails) {
        const payload = {
          disclosureId,
          pros: result.pros || '',
          cons: result.cons || '',
          note: result.note || '',
          meds: result.meds || '',
          audioFile: audioFile?.audioBlob || null,
          deleteAudioFile: audioFile?.audioBlob === null && disclosureDetails.audio ? true : undefined,
        };

        await mutateDisclosureDetails({ type: 'UPDATE', dto: payload });
      } else {
        const payload = {
          disclosureId,
          pros: result.pros || '',
          cons: result.cons || '',
          note: result.note || '',
          meds: result.meds || '',
          audioFile: audioFile?.audioBlob || null,
        };

        await mutateDisclosureDetails({ type: 'INSERT', dto: payload });
      }

      navigate(-1);
      notifySuccess(disclosureDetails ? STRINGS.edited_successfully : STRINGS.added_successfully);
    } catch (error) {
      notifyError(error);
    }
  };

  const isLoading = isMutatingDisclosureDetails || isGetting;

  return (
    <Card
      sx={{
        touchAction: 'pan-down',
      }}
    >
      <Header title={STRINGS.disclosures_details} showBackButton />
      <DisclosureDetailsActionForm ref={ref} disclosureDetails={disclosureDetails} />
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
}

export default DisclosureDetailsActionPage;
