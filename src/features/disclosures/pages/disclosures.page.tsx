import { Button, Stack } from "@mui/material";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/core/constants/properties.constant";
import DisclosureFilters, {
  type TDisclosureFiltesHandlers,
} from "../components/disclosure-filters.component";
import DisclosureCard from "../components/disclosure-card.component";
import { Add, Filter, Search } from "@mui/icons-material";
import { useDisclosuresLoader } from "../hooks/disclosures-loader.hook";
import { useRef, useState } from "react";
import type { TGetDisclosuresDto } from "../types/disclosure.types";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";
import ErrorCard from "@/core/components/common/error-card/error-card.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import ReusableSidebar from "@/core/components/common/reusable-sidebar/reusable-sidebar.component";
import useUrlToggleState from "@/core/hooks/use-url-state.hook";
import { useNavigate } from "react-router-dom";

const DisclosuresPage = () => {
  const [queryData, setQueryData] = useState<TGetDisclosuresDto>({
    pageSize: DEFAULT_PAGE_SIZE,
    pageNumber: DEFAULT_PAGE_NUMBER,
  });

  const navigate = useNavigate();

  const filtersRef = useRef<TDisclosureFiltesHandlers | null>(null);

  const { value: openFiltersSidebar, toggleValue: toggleOpenFiltersSidebar } =
    useUrlToggleState("open_filters");

  const {
    items,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useDisclosuresLoader(queryData);

  if (error) {
    return <ErrorCard error={error} />;
  }
  console.log({ items });

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      <VirtualizedList
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: items.length,
        }}
        onEndReach={
          hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined
        }
        isLoading={isFetchingNextPage}
      >
        {({ item: d }) => <DisclosureCard disclosure={d} key={d.id} />}
      </VirtualizedList>
      <ActionsFab
        actions={[
          {
            label: STRINGS.add_disclosure,
            icon: <Add />,
            onClick: () => navigate("/disclosures/action"),
          },
          {
            label: STRINGS.filter,
            icon: <Filter />,
            onClick: () => toggleOpenFiltersSidebar(),
          },
        ]}
      />
      <ReusableSidebar
        open={openFiltersSidebar}
        actions={
          <Button
            startIcon={<Search />}
            onClick={() => {
              setQueryData({
                pageNumber: DEFAULT_PAGE_NUMBER,
                pageSize: DEFAULT_PAGE_SIZE,
                ...filtersRef.current!.getValues(),
              });
              toggleOpenFiltersSidebar();
            }}
          >
            {STRINGS.search}
          </Button>
        }
      >
        <DisclosureFilters ref={filtersRef} />
      </ReusableSidebar>
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosuresPage;
