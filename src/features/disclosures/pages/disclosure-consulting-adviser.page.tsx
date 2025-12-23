import { useNavigate, useParams } from "react-router-dom";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Add } from "@mui/icons-material";
import { Card } from "@mui/material";
import DisclosureConsultingAdviserCards from "../components/disclosure-consulting-adviser-cards.component";

const DisclosureConsultingAdviserPage = () => {
  const { disclosureId } = useParams();
  const navigate = useNavigate();

  return (
    <Card sx={{ p: 2 }}>
      <DisclosureConsultingAdviserCards disclosureId={disclosureId} />
      <ActionFab
        icon={<Add />}
        color="success"
        onClick={() =>
          navigate(`/disclosures/${disclosureId}/consulting_adviser/action`)
        }
      />
    </Card>
  );
};

export default DisclosureConsultingAdviserPage;
