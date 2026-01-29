import { useParams } from 'react-router-dom';
import { Card, Stack } from '@mui/material';
import PageLoading from '@/core/components/common/page-loading/page-loading.component';
import BeneficiaryDisclosures from '../components/beneficiary-disclosures.component';
// import BeneficiaryMedicines from "../components/beneficiary-medicines.component";
// import type {
//   TBeneficiaryMedicine,
//   TFamilyMember,
// } from "../types/beneficiary.types";
// import BeneficiaryFamilyMembers from "../components/beneficiary-family-members.component";
import BeneficiaryCommonCard from '@/shared/components/beneficiary-common-card';
import { useBeneficiaryLoader } from '../hooks/use-beneficiary-loader.hook';
import ErrorCard from '@/core/components/common/error-card/error-card.component';

const BeneficiaryPage = () => {
  const { id = '' } = useParams();

  const { data: beneficiary, isLoading, error } = useBeneficiaryLoader({ id });

  // const handleOpenBeneficiaryMedicineActionPage = (
  //   bm?: TBeneficiaryMedicine
  // ) => {
  //   navigate(`/beneficiaries/${beneficiary?.id}/medicine/action`, {
  //     state: { oldBeneficiaryMedicine: bm },
  //   });
  // };

  // const handleOpenFamilyMembersActionPage = (oldMember?: TFamilyMember) => {
  //   navigate(`/beneficiaries/${beneficiary?.id}/family/action`, {
  //     state: { oldMember },
  //   });
  // };

  if (error) return <ErrorCard error={error} />;

  if (isLoading || !beneficiary) return <PageLoading />;

  return (
    <Stack gap={1}>
      <Card>
        <BeneficiaryCommonCard beneficiary={beneficiary} />
      </Card>
      <BeneficiaryDisclosures beneficiaryId={beneficiary.id} />
    </Stack>
  );
};

export default BeneficiaryPage;
