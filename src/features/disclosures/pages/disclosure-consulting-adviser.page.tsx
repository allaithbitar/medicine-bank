import { useNavigate, useParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Add } from '@mui/icons-material';
import { Card } from '@mui/material';
import DisclosureConsultingAdviserCards from '../components/disclosure-consulting-adviser-cards.component';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';

const DisclosureConsultingAdviserPage = () => {
  const { disclosureId } = useParams();
  const navigate = useNavigate();

  return (
    <Card sx={{ minHeight: '100%' }}>
      <Header title={STRINGS.consulting_adviser} />
      <DisclosureConsultingAdviserCards disclosureId={disclosureId} />
      <ActionFab
        icon={<Add />}
        color="success"
        onClick={() => navigate(`/disclosures/${disclosureId}/consulting_adviser/action`)}
      />
    </Card>
  );
};

export default DisclosureConsultingAdviserPage;
