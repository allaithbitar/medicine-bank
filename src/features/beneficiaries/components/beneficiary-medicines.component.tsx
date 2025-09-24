import { Stack } from "@mui/material";
import beneficiaryApi from "../api/beneficiary.api";
import BeneficiaryMedicinesList from "./beneficiary-medicines/beneficiary-medicines-list.component";
import type { TBeneficiaryMedicine } from "../types/beneficiary.types";

function BeneficiaryMedicines({
  beneficiaryId,
  onEditBeneficiaryMedicine,
}: {
  beneficiaryId?: string;
  onEditBeneficiaryMedicine: (bm: TBeneficiaryMedicine) => void;
}) {
  const {
    data: { items: beneficiaryMedicines = [] } = { items: [] },
    isLoading,
  } = beneficiaryApi.useGetBeneficiaryMedicinesQuery(
    { patientId: beneficiaryId },
    { skip: !beneficiaryId }
  );
  return (
    <Stack>
      <BeneficiaryMedicinesList
        items={beneficiaryMedicines}
        isLoading={isLoading}
        onEdit={onEditBeneficiaryMedicine}
      />
    </Stack>
  );
}

export default BeneficiaryMedicines;
