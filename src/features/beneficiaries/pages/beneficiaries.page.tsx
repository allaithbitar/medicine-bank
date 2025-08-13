import { useNavigate } from "react-router-dom";
import BeneficiaryCard from "../components/beneficiary-card.component";
import { Add } from "@mui/icons-material";
import STRINGS from "@/core/constants/strings.constant";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { Button, Card, Grid, Stack } from "@mui/material";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import { useBeneficiariesLoader } from "../hooks/use-beneficiaries-loader.hook";
import { useRef, useState } from "react";
import type { TGetBeneficiariesDto } from "../types/beneficiary.types";
import BeneficiariesFilters, {
  type TBeneficiariesFiltersHandlers,
} from "../components/beneficiaries-filters.component";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";

const BeneficiariesPage = () => {
  const [queryData, setQueryData] = useState<TGetBeneficiariesDto>({
    pageSize: 4,
    pageNumber: 0,
  });
  const { items, isLoading } = useBeneficiariesLoader(queryData);

  const filtersRef = useRef<TBeneficiariesFiltersHandlers | null>(null);

  const navigate = useNavigate();

  return (
    <Stack gap={2}>
      <Card>
        <Stack gap={2}>
          <BeneficiariesFilters ref={filtersRef} />
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
        {items.map((b) => (
          <Grid size={DEFAULT_GRID_SIZES} key={b.id}>
            <BeneficiaryCard
              beneficiary={b}
              key={b.id}
              onEnterClick={navigate}
            />
          </Grid>
        ))}

        <ActionsFab
          actions={[
            {
              icon: <Add />,
              label: STRINGS.add_beneficiary,
              onClick: () => navigate("/beneficiaries/action"),
            },
          ]}
        />
      </Grid>
      {isLoading && <PageLoading />}
    </Stack>
  );
};

export default BeneficiariesPage;
