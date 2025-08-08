import Nodata from "@/core/components/common/no-data/no-data.component";
import STRINGS from "@/core/constants/strings.constant";
import disclosuresApi from "@/features/disclosures/api/disclosures.api";
import DisclosureCard from "@/features/disclosures/components/disclosure-card.component";
import { Stack } from "@mui/material";

const BeneficiaryDisclosures = ({
  beneficiaryId,
}: {
  beneficiaryId?: string;
}) => {
  const {
    data: { items: disclosures } = { items: [] },
    isLoading,
    isFetching,
  } = disclosuresApi.useGetDisclosuresQuery(
    { patientId: beneficiaryId },
    { skip: !beneficiaryId },
  );

  const isEmpty = !isLoading && !isFetching && disclosures.length === 0;

  return (
    <Stack>
      {disclosures.map((d) => (
        <DisclosureCard disclosure={d} />
      ))}
      {isEmpty && (
        <Nodata title={STRINGS.beneficiary_doesnt_have_any_disclosure} />
      )}
    </Stack>
  );
};

export default BeneficiaryDisclosures;
