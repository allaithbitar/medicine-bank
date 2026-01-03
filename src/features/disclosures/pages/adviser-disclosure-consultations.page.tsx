import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { Card, Stack } from '@mui/material';
import disclosuresApi from '../api/disclosures.api';
import { ConsultingAdviserCard } from '../components/consulting-adviser-card.component';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';

function AdviserDisclosureConsultationsPage() {
  const { data: response = { items: [] }, isFetching } = disclosuresApi.useGetDisclosureAdviserConsultationsQuery({});
  const adviserConsultations = response.items ?? [];

  return (
    <Card>
      <Stack gap={2} sx={{ position: 'relative' }}>
        <Header title={STRINGS.consulting_adviser} />
        {adviserConsultations.map((ac) => (
          <ConsultingAdviserCard key={ac.id} adviserConsultation={ac} footerContent="quick actions" />
        ))}
        {!isFetching && !adviserConsultations.length && <Nodata />}
        {isFetching && <LoadingOverlay />}
      </Stack>
    </Card>
  );
}

export default AdviserDisclosureConsultationsPage;
