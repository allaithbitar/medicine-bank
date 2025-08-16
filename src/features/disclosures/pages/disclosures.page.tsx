import { Button, Card, Grid, Stack } from "@mui/material";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import DisclosureFilters, {
  type TDisclosureFiltesHandlers,
} from "../components/disclosure-filters.component";
import { Link } from "react-router-dom";
import DisclosureCard from "../components/disclosure-card.component";
import { Add } from "@mui/icons-material";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { useDisclosuresLoader } from "../hooks/disclosures-loader.hook";
import { useRef, useState } from "react";
import type { TGetDisclosuresDto } from "../types/disclosure.types";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const DisclosuresPage = () => {
  const filtersRef = useRef<TDisclosureFiltesHandlers | null>(null);

  const [queryData, setQueryData] = useState<TGetDisclosuresDto>({
    pageSize: 4,
    pageNumber: 0,
  });
  console.log(queryData);

  const { items, error, isLoading } = useDisclosuresLoader(queryData);

  return (
    <Stack gap={2}>
      <Card>
        <Stack gap={2}>
          <DisclosureFilters ref={filtersRef} />
          <Button
            onClick={() =>
              setQueryData((prev) => ({
                ...prev,
                ...filtersRef.current!.getValues(),
              }))
            }
          >
            {STRINGS.search}
          </Button>
        </Stack>
      </Card>
      <Grid container spacing={2}>
        {items.map((d) => (
          <Grid size={DEFAULT_GRID_SIZES} key={d.id}>
            <DisclosureCard disclosure={d} />
          </Grid>
        ))}
        {JSON.stringify(error)}
      </Grid>
      <Link to="action">
        <ActionFab icon={<Add />} color="primary" />
      </Link>
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosuresPage;
