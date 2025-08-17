import { Card } from "@mui/material";
import DisclosureActionForm, {
  type TDisclosureFormHandlers,
} from "../components/disclosure-action-form.component";
import { useRef } from "react";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import disclosuresApi from "../api/disclosures.api";
import type { TAddDisclosureDto } from "../types/disclosure.types";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const DisclosureActionPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const beneficiaryId = searchParams.get("beneficiaryId");

  const disclosureId = searchParams.get("disclosureId");

  const { data: disclosureData, isFetching: isGetting } =
    disclosuresApi.useGetDisclosureQuery(
      { id: disclosureId! },
      { skip: !disclosureId },
    );

  const [addDisclosure, { isLoading: isAdding }] =
    disclosuresApi.useAddDisclosureMutation();

  const [updateDisclosure, { isLoading: isUpdating }] =
    disclosuresApi.useUpdateDisclosureMutation();

  const ref = useRef<TDisclosureFormHandlers | null>(null);

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid) return;

    try {
      const addDto: TAddDisclosureDto = {
        status: result.status?.id,
        scoutId: result.employee?.id ?? null,
        patientId: beneficiaryId ?? result.beneficiary!.id,
        priorityId: result.priorityDegree!.id,
      };

      if (!disclosureId) {
        const { error } = await addDisclosure(addDto);

        if (error) {
          notifyError(getErrorMessage(error));
        } else {
          navigate(-1);
          notifySuccess(STRINGS.added_successfully);
        }
      } else {
        const { error } = await updateDisclosure({
          ...addDto,
          id: disclosureId,
        });
        if (error) {
          notifyError(getErrorMessage(error));
        } else {
          navigate(-1);
          notifySuccess(STRINGS.edited_successfully);
        }
      }
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };
  const isLoading = isAdding || isUpdating || isGetting;

  return (
    <Card>
      <DisclosureActionForm
        ref={ref}
        beneficiaryAlreadyDefined={!!beneficiaryId}
        disclosureData={disclosureData}
      />
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={handleSave}
        disabled={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default DisclosureActionPage;
