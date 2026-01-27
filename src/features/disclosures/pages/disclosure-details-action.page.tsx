import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { Save } from '@mui/icons-material';
import { Card } from '@mui/material';
import { useRef } from 'react';
import DisclosureDetailsActionForm, {
  type TDisclosureDetailsFormHandlers,
} from '../components/disclosure-detials-action-form.component';
import disclosuresApi from '../api/disclosures.api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import STRINGS from '@/core/constants/strings.constant';
import Header from '@/core/components/common/header/header';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import type { THouseHoldAssetCondition, THouseOwnership } from '@/libs/kysely/schema';

function DisclosureDetailsActionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = useRef<TDisclosureDetailsFormHandlers | null>(null);
  const disclosureId = searchParams.get('disclosureId');

  const { data: disclosureDetails, isFetching: isGetting } = disclosuresApi.useGetDisclosureDetailsQuery(
    { disclosureId: disclosureId! },
    { skip: !disclosureId }
  );

  const [addDisclosureDetails, { isLoading: isAdding }] = disclosuresApi.useAddDisclosureDetailsMutation();
  const [updateDisclosureDetails, { isLoading: isUpdating }] = disclosuresApi.useUpdateDisclosureDetailsMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid || !disclosureId) return;

    try {
      const payload = {
        disclosureId,
        diseasesOrSurgeries: result.diseasesOrSurgeries || null,
        jobOrSchool: result.jobOrSchool || null,
        electricity: result.electricity || null,
        expenses: result.expenses || null,
        houseOwnership: (result.houseOwnership?.id as THouseOwnership) || null,
        houseOwnershipNote: result.houseOwnershipNote || null,
        houseCondition: (result.houseCondition?.id as THouseHoldAssetCondition) || null,
        houseConditionNote: result.houseConditionNote || null,
        pros: result.pros || null,
        cons: result.cons || null,
        other: result.other || null,
      };

      const mutation = disclosureDetails ? updateDisclosureDetails : addDisclosureDetails;
      const { error } = await mutation(payload);

      if (error) {
        notifyError(error);
      } else {
        navigate(-1);
        notifySuccess(disclosureDetails ? STRINGS.edited_successfully : STRINGS.added_successfully);
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const isLoading = isUpdating || isGetting || isAdding;

  return (
    <Card>
      <Header title={STRINGS.disclosures_details} />
      <DisclosureDetailsActionForm ref={ref} disclosureDetails={disclosureDetails} />
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
}

export default DisclosureDetailsActionPage;
