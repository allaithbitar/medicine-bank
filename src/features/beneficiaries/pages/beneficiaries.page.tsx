import { useNavigate } from "react-router-dom";
import BeneficiaryCard from "../components/beneficiary-card.component";
import { Add } from "@mui/icons-material";
import STRINGS from "@/core/constants/strings.constant";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { Stack } from "@mui/material";
import { DEFAULT_PAGE_NUMBER } from "@/core/constants/properties.constant";
import { useBeneficiariesLoader } from "../hooks/use-beneficiaries-loader.hook";
import { useState } from "react";
import type { TGetBeneficiariesDto } from "../types/beneficiary.types";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";
import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";

const BeneficiariesPage = () => {
  const [queryData] = useState<TGetBeneficiariesDto>({
    pageSize: 1000,
    pageNumber: DEFAULT_PAGE_NUMBER,
  });
  const { items = [], isLoading } = useBeneficiariesLoader(queryData);

  // const filtersRef = useRef<TBeneficiariesFiltersHandlers | null>(null);

  const navigate = useNavigate();

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      {/*  <Card>
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
  */}
      <VirtualizedList
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: items.length,
        }}
      >
        {({ item: b }) => {
          return (
            <BeneficiaryCard
              beneficiary={b}
              key={b.id}
              onEnterClick={navigate}
            />
          );
        }}
      </VirtualizedList>
      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.add_beneficiary,
            onClick: () => navigate("/beneficiaries/action"),
          },
        ]}
      />
      {isLoading && <PageLoading />}
    </Stack>
  );
};

export default BeneficiariesPage;
