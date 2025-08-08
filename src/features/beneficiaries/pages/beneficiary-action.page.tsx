import STRINGS from "@/core/constants/strings.constant";
import { Card, Stack } from "@mui/material";
import type { TAddBeneficiaryDto } from "../types/beneficiary.types";
import { useRef } from "react";
import beneficiaryApi from "../api/beneficiary.api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import { getErrorMessage } from "@/core/helpers/helpers";
import type { TBenefificaryFormHandlers } from "../components/beneficiary-action-form.component";
import BeneficiaryActionForm from "../components/beneficiary-action-form.component";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const BeneficiaryActionPage = () => {
  const { id: beneficiaryId } = useParams();

  const ref = useRef<TBenefificaryFormHandlers | null>(null);

  const navigate = useNavigate();

  const [addBeneficiary, { isLoading: isAdding }] =
    beneficiaryApi.useAddBeneficiaryMutation();

  const [updateBeneficiary, { isLoading: isUpdating }] =
    beneficiaryApi.useUpdateBeneficiaryMutation();

  const { data: beneficiaryData, isLoading: isGetting } =
    beneficiaryApi.useGetBeneficiaryQuery(
      { id: beneficiaryId ?? "" },
      { skip: !beneficiaryId || beneficiaryId === "new" },
    );

  const isLoading = isAdding || isUpdating || isGetting;

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    console.log({ isValid, result });

    if (!isValid) return;
    try {
      const addDto: TAddBeneficiaryDto = {
        name: result.name,
        nationalNumber: result.nationalNumber,
        areaId: result.area?.id,
        about: result.about,
        address: result.address,
        phoneNumbers: result.phoneNumbers,
      };

      if (!beneficiaryId) {
        const { error } = await addBeneficiary(addDto);

        if (error) {
          notifyError(getErrorMessage(error));
        } else {
          navigate(-1);
          notifySuccess(STRINGS.added_successfully);
        }
      } else {
        const { error } = await updateBeneficiary({
          ...addDto,
          id: beneficiaryId,
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

  return (
    <Card>
      <Stack gap={2} sx={{ position: "relative" }}>
        <BeneficiaryActionForm ref={ref} beneficiaryData={beneficiaryData} />
        <ActionFab icon={<Save />} color="success" onClick={handleSave} />
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryActionPage;
