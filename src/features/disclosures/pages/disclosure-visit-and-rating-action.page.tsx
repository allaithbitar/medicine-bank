import { useLocation, useNavigate } from "react-router-dom";
import DisclosureRatingActionForm, {
  type TDisclosureRatingFormHandlers,
} from "../components/disclosure-rating-action-form.component";
import { useRef } from "react";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import disclosuresApi from "../api/disclosures.api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import type { TDisclosure } from "../types/disclosure.types";
import DisclosureVisitActionForm, {
  type TDisclosureVisitFormHandlers,
} from "../components/disclosure-visit-action-form.component";
import { Stack } from "@mui/material";

const DisclosureVisitAndRatingActionPage = () => {
  const { state } = useLocation();
  const disclosure: TDisclosure = state;
  const ratingRef = useRef<TDisclosureRatingFormHandlers | null>(null);
  const visitRef = useRef<TDisclosureVisitFormHandlers | null>(null);

  const navigate = useNavigate();

  const [updateDisclosureRating, { isLoading }] =
    disclosuresApi.useUpdateDisclosureMutation();

  const handleSave = async () => {
    const { isValid: isVisitValid, result: visitResult } =
      await visitRef.current!.handleSubmit();
    const { isValid: isValidRate, result: rateResult } =
      await ratingRef.current!.handleSubmit();
    if (!isVisitValid || !isValidRate || !disclosure.id) return;

    try {
      const updateDto = {
        id: disclosure.id,
        isCustomRating: rateResult.isCustomRating,
        ratingId: rateResult.isCustomRating ? null : rateResult.rating?.id,
        customRating: rateResult.customRating || null,
        ratingNote: rateResult.note || null,
        visitResult: visitResult.result!.id,
        visitReason:
          visitResult.result?.id !== "completed" ? visitResult.reason : null,
        visitNote: visitResult.note || null,
      };

      const { error } = await updateDisclosureRating(updateDto);

      if (error) {
        notifyError(error);
      } else {
        navigate(-1);
        notifySuccess(STRINGS.added_successfully);
      }
    } catch (error: any) {
      notifyError(error);
    }
  };

  const disclosureRatingData = {
    isCustom: disclosure.isCustomRating,
    customRating: disclosure.customRating,
    ratingId: disclosure.rating?.id,
    rating: disclosure.rating,
  };
  return (
    <Stack>
      <DisclosureVisitActionForm
        ref={visitRef}
        disclosureVisitData={{
          visitNote: disclosure?.visitNote,
          visitReason: disclosure?.visitReason,
          visitResult: disclosure?.visitResult ?? "not_completed",
        }}
      />

      <DisclosureRatingActionForm
        ref={ratingRef}
        disclosureRatingData={disclosureRatingData as any}
      />
      <ActionFab
        color="success"
        icon={<Save />}
        disabled={isLoading}
        onClick={handleSave}
      />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureVisitAndRatingActionPage;
