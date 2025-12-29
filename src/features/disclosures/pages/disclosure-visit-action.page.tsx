import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import type { TDisclosure } from "../types/disclosure.types";
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
  const { state } = useLocation();
  const disclosure: TDisclosure = state;
  const ref = useRef<TDisclosureVisitFormHandlers | null>(null);
  const navigate = useNavigate();

  // const { data: disclosureVisitData, isFetching: isGetting } =
  //   disclosuresApi.useGetDisclosureVisitQuery(
  //     { id: visitId! },
  //     { skip: !visitId }
  //   );

  const [updateDisclosureVisit, { isLoading }] =
    disclosuresApi.useUpdateDisclosureMutation();

  // const [addDisclosureVisit, { isLoading: isAdding }] =
  //   disclosuresApi.useAddDisclosureVisitMutation();

  // const [updateDisclosureVisit, { isLoading: isUpdating }] =
  //   disclosuresApi.useUpdateDisclosureVisitMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid || !disclosure.id) return;

    try {
      const updateDto = {
        id: disclosure.id,
        visitResult: result.result!.id,
        visitReason:
          result.result?.id === "cant_be_completed" ? result.reason : "",
        visitNote: result.note || null,
      };

      const { error } = await updateDisclosureVisit(updateDto);

      if (error) {
        notifyError(error);
      } else {
        navigate(-1);
        notifySuccess(STRINGS.added_successfully);
      }

      // if (!visitId) {
      //   const { error } = await addDisclosureVisit(addDto);

      //   if (error) {
      //     notifyError(error);
      //   } else {
      //     navigate(-1);
      //     notifySuccess(STRINGS.added_successfully);
      //   }
      // } else {
      //   const { error } = await updateDisclosureVisit({
      //     ...addDto,
      //     id: visitId!,
      //   });
      //   if (error) {
      //     notifyError(error);
      //   } else {
      //     navigate(-1);
      //     notifySuccess(STRINGS.edited_successfully);
      //   }
      // }
    } catch (error: any) {
      notifyError(error);
    }
  };
  // const isLoading = isGetting || isAdding || isUpdating;

  return (
    <div>
      <DisclosureVisitActionForm
        ref={ref}
        disclosureVisitData={{
          visitNote: disclosure?.visitNote,
          visitReason: disclosure?.visitReason,
          visitResult: disclosure?.visitResult ?? "not_completed",
        }}
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
