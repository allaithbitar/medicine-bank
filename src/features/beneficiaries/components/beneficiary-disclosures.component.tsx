import Nodata from "@/core/components/common/no-data/no-data.component";
import {
  DEFAULT_GRID_SIZES,
  DEFAULT_PAGE_SIZE,
} from "@/core/constants/properties.constant";
import STRINGS from "@/core/constants/strings.constant";
import DisclosureCard from "@/features/disclosures/components/disclosure-card.component";
import { useDisclosuresLoader } from "@/features/disclosures/hooks/disclosures-loader.hook";
import { Grid } from "@mui/material";

const BeneficiaryDisclosures = ({
  beneficiaryId,
}: {
  beneficiaryId?: string;
}) => {
  const { items, isLoading, isFetching } = useDisclosuresLoader({
    pageSize: DEFAULT_PAGE_SIZE,
    patientId: beneficiaryId,
  });

  const isEmpty = !isLoading && !isFetching && items.length === 0;

  return (
    <>
      <Grid container spacing={2}>
        {items.map((d) => (
          <Grid size={DEFAULT_GRID_SIZES} key={d.id}>
            <DisclosureCard disclosure={d} />
          </Grid>
        ))}
      </Grid>
      {isEmpty && (
        <Nodata title={STRINGS.beneficiary_doesnt_have_any_disclosure} />
      )}
    </>
  );
};

export default BeneficiaryDisclosures;
