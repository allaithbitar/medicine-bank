import STRINGS from "@/core/constants/strings.constant";
import { Card, Stack } from "@mui/material";
import type { TAddBeneficiaryDto } from "../types/beneficiary.types";
import { useRef, useState } from "react";
import beneficiaryApi from "../api/beneficiary.api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import type { TBenefificaryFormHandlers } from "../components/beneficiary-action-form.component";
import BeneficiaryActionForm from "../components/beneficiary-action-form.component";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const BeneficiaryActionPage = () => {
  const [searchParams] = useSearchParams();

  const beneficiaryId = searchParams.get("beneficiaryId");

  const ref = useRef<TBenefificaryFormHandlers | null>(null);

  const navigate = useNavigate();

  const [addBeneficiary, { isLoading: isAdding }] =
    beneficiaryApi.useAddBeneficiaryMutation();

  const [updateBeneficiary, { isLoading: isUpdating }] =
    beneficiaryApi.useUpdateBeneficiaryMutation();

  const { data: beneficiaryData, isLoading: isGetting } =
    beneficiaryApi.useGetBeneficiaryQuery(
      { id: beneficiaryId ?? "" },
      { skip: !beneficiaryId },
    );

  const isLoading = isAdding || isUpdating || isGetting;

  const [validateNationalNumber] =
    beneficiaryApi.useValidateNationalNumberMutation();

  const [validatePhoneNumber] =
    beneficiaryApi.useValidatePhoneNumbersMutation();

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();

    if (!isValid) return;
    try {
      const r = await validateNationalNumber({
        nationalNumber: result.nationalNumber,
        ...(beneficiaryId && { patientId: beneficiaryId }),
      });

      const rr = await validatePhoneNumber({
        phoneNumbers: result.phoneNumbers,
        ...(beneficiaryId && { patientId: beneficiaryId }),
      });

      console.log({ r, rr });
      return;

      const addDto: TAddBeneficiaryDto = {
        name: result.name,
        nationalNumber: result.nationalNumber,
        areaId: result.area?.id,
        about: result.about,
        address: result.address,
        phoneNumbers: result.phoneNumbers,
        gender: result.gender?.id ?? "",
        job: result.job,
        // birthDate: result.birthDate
        //   ? addTimeZoneOffestToIsoDate(result.birthDate)
        //       .toISOString()
        //       .split("T")[0]
        //   : "",
        birthDate: (result.birthDate || "")?.split("T")[0] ?? "",
      };

      if (!beneficiaryId) {
        const { error } = await addBeneficiary(addDto);

        if (error) {
          notifyError(error);
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
