import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import beneficiaryApi from "../api/beneficiary.api";
import { Card, Stack, Tab, Tabs } from "@mui/material";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import BeneficiaryDisclosures from "../components/beneficiary-disclosures.component";
// import BeneficiaryMedicines from "../components/beneficiary-medicines.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
// import type {
//   TBeneficiaryMedicine,
//   TFamilyMember,
// } from "../types/beneficiary.types";
// import BeneficiaryFamilyMembers from "../components/beneficiary-family-members.component";
import BeneficiaryCommonCard from "@/shared/components/beneficiary-common-card";

const BeneficiaryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get("tab") ?? 0);
  const { id } = useParams();

  const { data: beneficiary, isLoading } =
    beneficiaryApi.useGetBeneficiaryQuery({ id: id! }, { skip: !id });

  // const handleOpenBeneficiaryMedicineActionPage = (
  //   bm?: TBeneficiaryMedicine
  // ) => {
  //   navigate(`/beneficiaries/${beneficiary?.id}/medicine/action`, {
  //     state: { oldBeneficiaryMedicine: bm },
  //   });
  // };

  const handleAddBeneficiaryDisclosure = () => {
    navigate(`/disclosures/action?beneficiaryId=${beneficiary?.id}`);
  };

  // const handleOpenFamilyMembersActionPage = (oldMember?: TFamilyMember) => {
  //   navigate(`/beneficiaries/${beneficiary?.id}/family/action`, {
  //     state: { oldMember },
  //   });
  // };

  if (isLoading || !beneficiary) return <PageLoading />;

  return (
    <Stack gap={2}>
      <Card>
        <BeneficiaryCommonCard beneficiary={beneficiary} />
      </Card>
      <Tabs
        variant="fullWidth"
        value={currentTab}
        onChange={(_, v) =>
          setSearchParams((prev) => ({ ...prev, tab: v }), { replace: true })
        }
        slotProps={{
          indicator: {
            sx: {
              height: "15%",
              borderRadius: 10,
            },
          },
        }}
      >
        <Tab label={STRINGS.disclosures} />
        {/* <Tab label={STRINGS.medicines} />
        <Tab label={STRINGS.family_members} /> */}
      </Tabs>
      {currentTab === 0 && (
        <BeneficiaryDisclosures beneficiaryId={beneficiary.id} />
      )}
      {/* {currentTab === 1 && (
        <BeneficiaryMedicines
          onEditBeneficiaryMedicine={(bm) =>
            handleOpenBeneficiaryMedicineActionPage(bm)
          }
          beneficiaryId={beneficiary.id}
        />
      )}
      {currentTab === 2 && (
        <BeneficiaryFamilyMembers
          onEditBeneficiaryFamilyMember={(m) =>
            handleOpenFamilyMembersActionPage(m)
          }
          beneficiaryId={beneficiary.id}
        />
      )} */}
      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.disclosures,
            onClick: () => handleAddBeneficiaryDisclosure(),
          },
          // {
          //   icon: <Add />,
          //   label: STRINGS.add_medicine,
          //   onClick: () => handleOpenBeneficiaryMedicineActionPage(undefined),
          // },
          // {
          //   icon: <Add />,
          //   label: STRINGS.add_family_member,
          //   onClick: () => handleOpenFamilyMembersActionPage(undefined),
          // },
        ]}
      />
    </Stack>
  );
};

export default BeneficiaryPage;
