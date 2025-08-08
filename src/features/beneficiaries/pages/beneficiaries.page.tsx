import { useNavigate } from "react-router-dom";
import beneficiaryApi from "../api/beneficiary.api";
import BeneficiaryCard from "../components/beneficiary-card.component";
import { Add } from "@mui/icons-material";
import STRINGS from "@/core/constants/strings.constant";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { Grid } from "@mui/material";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";

const BeneficiariesPage = () => {
  const { data: { items: beneficiaries = [] } = { items: [] } } =
    beneficiaryApi.useGetBeneficiariesQuery({});

  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {beneficiaries.map((b) => (
        <Grid size={DEFAULT_GRID_SIZES} key={b.id}>
          <BeneficiaryCard beneficiary={b} key={b.id} onEnterClick={navigate} />
        </Grid>
      ))}

      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.add_beneficiary,
            onClick: () => navigate("/beneficiaries/new/action"),
          },
        ]}
      />
    </Grid>
  );
};

export default BeneficiariesPage;
