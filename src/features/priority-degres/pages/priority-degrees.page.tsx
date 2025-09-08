import { useCallback, useState } from "react";
import { Stack } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import priorityDegreesApi from "../api/priority-degrees.api";
import CustomAppBarComponent from "@/core/components/common/custom-app-bar/custom-app-bar.component";
import STRINGS from "@/core/constants/strings.constant";
import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import PriorityDegreesList from "../components/priority-degreesList.component";
import type { TPriorityDegree } from "../types/priority-degree.types";

const PriorityDegreesPage = () => {
  const { openModal } = useModal();
  const [query, setQuery] = useState<string | null>("");

  const { data: priorityDegrees = [], isLoading: isLoadingPriorityDegrees } =
    priorityDegreesApi.useGetPriorityDegreesQuery({ name: query ?? undefined });

  const handleOpenPriorityDegreeModal = useCallback(
    (oldPriorityDegree?: TPriorityDegree) => {
      openModal({
        name: "PRIORITY_DEGREE_FORM_MODAL",
        props: {
          oldPriorityDegree,
        },
      });
    },
    [openModal]
  );

  const handleSearch = useCallback((q: string | null) => {
    setQuery(q);
  }, []);

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      <CustomAppBarComponent
        title={STRINGS.priority_degrees}
        subtitle={STRINGS.add_manage_priority_degrees}
        children={
          <SearchFilter
            initialQuery={query}
            onSearch={handleSearch}
            placeholder={STRINGS.search_priority_degree}
          />
        }
      />
      <PriorityDegreesList
        isLoadingPriorityDegrees={isLoadingPriorityDegrees}
        priorityDegrees={priorityDegrees}
        onEdit={handleOpenPriorityDegreeModal}
      />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenPriorityDegreeModal(),
          },
        ]}
      />
    </Stack>
  );
};

export default PriorityDegreesPage;
