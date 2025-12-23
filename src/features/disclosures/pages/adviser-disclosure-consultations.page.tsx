import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import Nodata from "@/core/components/common/no-data/no-data.component";
import { Stack } from "@mui/material";
import disclosuresApi from "../api/disclosures.api";
import { ConsultingAdviserCard } from "../components/consulting-adviser-card.component";

function AdviserDisclosureConsultationsPage() {
  const { data: response = { items: [] }, isFetching } =
    disclosuresApi.useGetDisclosureAdviserConsultationsQuery({});
  const adviserConsultations = response.items ?? [];

  return (
    <Stack gap={2} sx={{ position: "relative" }}>
      {adviserConsultations.map((ac) => (
        <ConsultingAdviserCard
          key={ac.id}
          adviserConsultation={ac}
          footerContent="quick actions"
        />
      ))}
      {!isFetching && !adviserConsultations.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
}

export default AdviserDisclosureConsultationsPage;
