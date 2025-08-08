import { Grid, Stack } from "@mui/material";
import disclosuresApi from "../api/disclosures.api";

import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import DisclosureFilters from "../components/disclosure-filters.component";
import { Link, useNavigate } from "react-router-dom";
import DisclosureCard from "../components/disclosure-card.component";
import { Add } from "@mui/icons-material";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";

const DisclosuresPage = () => {
  const { data, error } = disclosuresApi.useGetDisclosuresQuery({});

  const { items } = data ?? { items: [] };

  const navigate = useNavigate();
  return (
    <Stack gap={2}>
      <DisclosureFilters />
      <Grid container spacing={2}>
        {items.map((d) => (
          <Grid size={DEFAULT_GRID_SIZES} key={d.id}>
            <DisclosureCard
              disclosure={d}
              onEnterClick={() => navigate(`/disclosures/${d.id}`)}
            />
          </Grid>
        ))}
        {JSON.stringify(error)}
      </Grid>
      <Link to="action">
        <ActionFab icon={<Add />} color="primary" />
      </Link>
    </Stack>
  );
};

export default DisclosuresPage;
