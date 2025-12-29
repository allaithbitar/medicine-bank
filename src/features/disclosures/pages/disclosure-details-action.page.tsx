import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import { Save } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useRef } from "react";
import DisclosureDetailsActionForm, {
  type TDisclosureDetailsFormHandlers,
} from "../components/disclosure-detials-action-form.component";
import disclosuresApi from "../api/disclosures.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import STRINGS from "@/core/constants/strings.constant";
import Header from "@/core/components/common/header/header";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";

function DisclosureDetailsActionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = useRef<TDisclosureDetailsFormHandlers | null>(null);
  const disclosureId = searchParams.get("disclosureId");

  const { data: disclosureData, isFetching: isGetting } =
    disclosuresApi.useGetDisclosureQuery(
      { id: disclosureId! },
      { skip: !disclosureId }
    );

  const [updateDisclosure, { isLoading: isUpdating }] =
    disclosuresApi.useUpdateDisclosureMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid || !disclosureId) return;
    try {
      const { error } = await updateDisclosure({
        id: disclosureId,
        // details: JSON.stringify(result),
        details: result,
      });
      if (error) {
        notifyError(error);
      } else {
        navigate(-1);
        notifySuccess(STRINGS.edited_successfully);
      }
    } catch (error) {
      notifyError(error);
    }
  };
  const isLoading = isUpdating || isGetting;
  return (
    <Card>
      <Header title={STRINGS.disclosures_details} />
      <DisclosureDetailsActionForm ref={ref} disclosureData={disclosureData} />
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={handleSave}
        disabled={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
}

export default DisclosureDetailsActionPage;
