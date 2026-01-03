import BeneficiaryFamilyMembers from '@/features/beneficiaries/components/beneficiary-family-members.component';
import type { TDisclosure } from '@/features/disclosures/types/disclosure.types';

const DisclosureFamilyMembersTab = ({
  disclosure,
  handleOpenFamilyMembersActionPage,
}: {
  disclosure?: TDisclosure;
  handleOpenFamilyMembersActionPage?: (m?: any) => void;
}) => {
  const beneficiaryId = disclosure?.patientId;
  return (
    <BeneficiaryFamilyMembers
      beneficiaryId={beneficiaryId}
      onEditBeneficiaryFamilyMember={(m) => handleOpenFamilyMembersActionPage && handleOpenFamilyMembersActionPage(m)}
      onAddBeneficiaryFamilyMember={() => handleOpenFamilyMembersActionPage && handleOpenFamilyMembersActionPage()}
    />
  );
};

export default DisclosureFamilyMembersTab;
