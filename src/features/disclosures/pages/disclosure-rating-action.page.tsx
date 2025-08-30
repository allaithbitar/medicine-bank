import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DisclosureRatingActionForm, {
  type TDisclosureRatingFormHandlers,
} from "../components/disclosure-rating-action-form.component";
import { useRef } from "react";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import type { TAddDisclosureRatingDto } from "../types/disclosure.types";
import disclosuresApi from "../api/disclosures.api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const DisclosureRatingActionPage = () => {
  const [searchParams] = useSearchParams();

  const ref = useRef<TDisclosureRatingFormHandlers | null>(null);

  const ratingId = searchParams.get("ratingId");

  const navigate = useNavigate();

  const { disclosureId } = useParams();

  const { data: disclosureRatingData, isFetching: isGetting } =
    disclosuresApi.useGetDisclosureRatingQuery(
      { id: ratingId! },
      { skip: !ratingId }
    );

  console.log({ disclosureRatingData });

  const [addDisclosureRating, { isLoading: isAdding }] =
    disclosuresApi.useAddDisclosureRatingMutation();

  const [updateDisclosureRating, { isLoading: isUpdating }] =
    disclosuresApi.useUpdateDisclosureRatingMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid || !disclosureId) return;

    try {
      const addDto: TAddDisclosureRatingDto = {
        disclosureId,
        isCustom: result.isCustomRating,
        ratingId: result.rating?.id ?? null,
        customRating: result.customRating || null,
        note: result.note || null,
      };

      if (!ratingId) {
        const { error } = await addDisclosureRating(addDto);

        if (error) {
          notifyError(error);
        } else {
          navigate(-1);
          notifySuccess(STRINGS.added_successfully);
        }
      } else {
        const { error } = await updateDisclosureRating({
          ...addDto,
          id: ratingId!,
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
      <DisclosureRatingActionForm
        ref={ref}
        disclosureRatingData={disclosureRatingData}
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

export default DisclosureRatingActionPage;
