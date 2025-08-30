import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import type { TAddDisclosureVisitDto } from "../types/disclosure.types";
import disclosuresApi from "../api/disclosures.api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import type { TDisclosureVisitFormHandlers } from "../components/disclosure-visit-action-form.component";
import DisclosureVisitActionForm from "../components/disclosure-visit-action-form.component";

const DisclosureVisitActionPage = () => {
  const [searchParams] = useSearchParams();

  const ref = useRef<TDisclosureVisitFormHandlers | null>(null);

  const visitId = searchParams.get("visitId");

  const navigate = useNavigate();

  const { disclosureId } = useParams();

  const { data: disclosureVisitData, isFetching: isGetting } =
    disclosuresApi.useGetDisclosureVisitQuery(
      { id: visitId! },
      { skip: !visitId }
    );

  const [addDisclosureVisit, { isLoading: isAdding }] =
    disclosuresApi.useAddDisclosureVisitMutation();

  const [updateDisclosureVisit, { isLoading: isUpdating }] =
    disclosuresApi.useUpdateDisclosureVisitMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid || !disclosureId) return;

    try {
      const addDto: TAddDisclosureVisitDto = {
        disclosureId,
        result: result.result!.id,
        reason: result.reason || "",
        note: result.note || null,
      };

      if (!visitId) {
        const { error } = await addDisclosureVisit(addDto);

        if (error) {
          notifyError(error);
        } else {
          navigate(-1);
          notifySuccess(STRINGS.added_successfully);
        }
      } else {
        const { error } = await updateDisclosureVisit({
          ...addDto,
          id: visitId!,
        });
        if (error) {
          notifyError(error);
        } else {
          navigate(-1);
          notifySuccess(STRINGS.edited_successfully);
        }
      }
    } catch (error: any) {
      notifyError(error);
    }
  };

  const isLoading = isGetting || isAdding || isUpdating;

  return (
    <div>
      <DisclosureVisitActionForm
        ref={ref}
        disclosureVisitData={disclosureVisitData}
      />
      <ActionFab
        color="success"
        icon={<Save />}
        disabled={isLoading}
        onClick={handleSave}
      />
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default DisclosureVisitActionPage;
