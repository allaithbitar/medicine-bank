import { Link, useParams } from "react-router-dom";
import beneficiaryApi from "../api/beneficiary.api";
import { Button, Card, Stack, Typography } from "@mui/material";
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

const BeneficiaryPage = () => {
  const { id } = useParams();

  const { data: beneficiary, isLoading } =
    beneficiaryApi.useGetBeneficiaryQuery({ id: id! }, { skip: !id });

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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1 }}
      >
        <Typography variant="h6">{STRINGS.disclosures}</Typography>
        <Link to={`/disclosures/action?beneficiaryId=${beneficiary.id}`}>
          <Button startIcon={<Add />}>{STRINGS.add}</Button>
        </Link>
      </Stack>
      <BeneficiaryDisclosures beneficiaryId={beneficiary.id} />
      {/* <DisclosureActionForm /> */}
    </Stack>
  );
};

export default BeneficiaryPage;
