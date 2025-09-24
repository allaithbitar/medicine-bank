import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import beneficiaryApi from "../api/beneficiary.api";
import { Button, Card, Stack, Tab, Tabs } from "@mui/material";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import {
  Add,
  Edit,
  EventAvailable,
  History,
  Info,
  LocationPin,
  Person,
  Phone,
  Pin,
} from "@mui/icons-material";
import { formatDateTime } from "@/core/helpers/helpers";
import BeneficiaryDisclosures from "../components/beneficiary-disclosures.component";
import BeneficiaryMedicines from "../components/beneficiary-medicines.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TBeneficiaryMedicine } from "../types/beneficiary.types";

const BeneficiaryPage = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get("tab") ?? 0);
  const { id } = useParams();

  const { data: beneficiary, isLoading } =
    beneficiaryApi.useGetBeneficiaryQuery({ id: id! }, { skip: !id });

  const handleOpenBeneficiaryMedicineModal = (bm?: TBeneficiaryMedicine) => {
    openModal({
      name: "BENEFICIARY_MEDICINE_FORM_MODAL",
      props: { patientId: beneficiary?.id, oldBeneficiaryMedicine: bm },
    });
  };

  const handleAddBeneficiaryDisclosure = () => {
    navigate(`/disclosures/action?beneficiaryId=${beneficiary?.id}`);
  };

  if (isLoading || !beneficiary) return <PageLoading />;

  return (
    <Stack gap={2}>
      <Card>
        <Stack gap={2}>
          <DetailItem
            label={STRINGS.name}
            icon={<Person />}
            value={beneficiary.name}
          />
          <DetailItem
            label={STRINGS.national_number}
            icon={<Pin />}
            value={beneficiary.nationalNumber}
          />
          <DetailItem
            label={STRINGS.phones}
            icon={<Phone />}
            value={beneficiary.phones.map((p) => p.phone).join(", ")}
          />
          <DetailItem
            icon={<LocationPin />}
            label={STRINGS.patient_address}
            value={`${beneficiary.area?.name ?? ""}  - ${beneficiary.address}`}
          />
          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={formatDateTime(beneficiary.createdAt)}
          />
          <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={formatDateTime(beneficiary.updatedAt)}
          />
          <DetailItem
            icon={<Info />}
            label={STRINGS.patient_about}
            value={beneficiary.about}
          />
          <Link
            to={`/beneficiaries/action?beneficiaryId=${beneficiary.id}`}
            style={{ marginInlineStart: "auto" }}
          >
            <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
          </Link>
        </Stack>
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
        <Tab label={STRINGS.medicines} />
      </Tabs>
      {currentTab === 0 && (
        <BeneficiaryDisclosures beneficiaryId={beneficiary.id} />
      )}
      {currentTab === 1 && (
        <BeneficiaryMedicines
          onEditBeneficiaryMedicine={(bm) =>
            handleOpenBeneficiaryMedicineModal(bm)
          }
          beneficiaryId={beneficiary.id}
        />
      )}
      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.disclosures,
            onClick: () => handleAddBeneficiaryDisclosure(),
          },
          {
            icon: <Add />,
            label: STRINGS.add_medicine,
            onClick: () => handleOpenBeneficiaryMedicineModal(undefined),
          },
        ]}
      />
    </Stack>
  );
};

export default BeneficiaryPage;
