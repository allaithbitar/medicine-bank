import BeneficiaryMedicines from '@/features/beneficiaries/components/beneficiary-medicines.component';
import type { TDisclosure } from '@/features/disclosures/types/disclosure.types';

const DisclosureMedicinesTab = ({
  disclosure,
  handleOpenBeneficiaryMedicineActionPage,
}: {
  disclosure?: TDisclosure;
  handleOpenBeneficiaryMedicineActionPage?: (bm?: any) => void;
}) => {
  const beneficiaryId = disclosure?.patientId;
  return (
    <BeneficiaryMedicines
      beneficiaryId={beneficiaryId}
      onAddBeneficiaryMedicine={() =>
        handleOpenBeneficiaryMedicineActionPage && handleOpenBeneficiaryMedicineActionPage()
      }
      onEditBeneficiaryMedicine={(bm) =>
        handleOpenBeneficiaryMedicineActionPage && handleOpenBeneficiaryMedicineActionPage(bm)
      }
    />
  );
};

export default DisclosureMedicinesTab;
