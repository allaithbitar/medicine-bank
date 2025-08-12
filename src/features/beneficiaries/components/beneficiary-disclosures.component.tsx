import Nodata from "@/core/components/common/no-data/no-data.component";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import STRINGS from "@/core/constants/strings.constant";
import disclosuresApi from "@/features/disclosures/api/disclosures.api";
import DisclosureCard from "@/features/disclosures/components/disclosure-card.component";
import { Grid } from "@mui/material";

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
    <Grid container spacing={2}>
      {disclosures.map((d) => (
        <Grid size={DEFAULT_GRID_SIZES} key={d.id}>
          <DisclosureCard disclosure={d} />
        </Grid>
      ))}
      {isEmpty && (
        <Nodata title={STRINGS.beneficiary_doesnt_have_any_disclosure} />
      )}
    </Grid>
  );
};

export default BeneficiaryDisclosures;
