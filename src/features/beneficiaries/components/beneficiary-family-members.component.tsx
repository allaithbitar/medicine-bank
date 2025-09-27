import { Stack } from "@mui/material";
import beneficiaryApi from "../api/beneficiary.api";
import FamilyMembersList from "./beneficiary-family-members/family-members-list.component";
import type { TFamilyMember } from "../types/beneficiary.types";

const BeneficiaryFamilyMembers = ({
  beneficiaryId,
  onEditBeneficiaryFamilyMember,
}: {
  beneficiaryId?: string;
  onEditBeneficiaryFamilyMember: (m: TFamilyMember) => void;
}) => {
  const { data: resp, isLoading } = beneficiaryApi.useGetFamilyMembersQuery({
    patientId: beneficiaryId,
  });

  const items = resp?.items ?? [];

  return (
    <Stack>
      <FamilyMembersList
        familyMembers={items}
        isLoading={isLoading}
        onEdit={onEditBeneficiaryFamilyMember}
      />
    </Stack>
  );
};

export default BeneficiaryFamilyMembers;
