import beneficiaryApi from '../api/beneficiary.api';
import BeneficiaryMedicinesList from './beneficiary-medicines/beneficiary-medicines-list.component';
import type { TBeneficiaryMedicine } from '../types/beneficiary.types';

function BeneficiaryMedicines({
  beneficiaryId,
  onEditBeneficiaryMedicine,
  onAddBeneficiaryMedicine,
}: {
  beneficiaryId?: string;
  onEditBeneficiaryMedicine: (bm: TBeneficiaryMedicine) => void;
  onAddBeneficiaryMedicine: () => void;
}) {
  const { data: { items: beneficiaryMedicines = [] } = { items: [] }, isLoading } =
    beneficiaryApi.useGetBeneficiaryMedicinesQuery({ patientId: beneficiaryId }, { skip: !beneficiaryId });
  return (
    <BeneficiaryMedicinesList
      items={beneficiaryMedicines}
      isLoading={isLoading}
      onEdit={onEditBeneficiaryMedicine}
      onAdd={onAddBeneficiaryMedicine}
    />
  );
}

export default BeneficiaryMedicines;
