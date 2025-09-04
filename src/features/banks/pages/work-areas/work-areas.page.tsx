import { useCallback, useState } from "react";
import { Stack } from "@mui/material";
import WorkAreasLists from "../../components/work-areas/work-area-lists/work-area-lists.component";
import WorkAreasAppBar from "../../components/work-areas/work-area-hidder/work-area-hidder.components";
import workAreasApi from "../../api/work-areas/work-areas.api";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TArea } from "../../types/work-areas.types";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { Add } from "@mui/icons-material";
import STRINGS from "@/core/constants/strings.constant";
import type { TCity } from "../../types/city.types";

const WorkAreas = () => {
  const { openModal } = useModal();
  const [selectedCity, setSelectedCity] = useState<TCity | null>(null);
  const [query, setQuery] = useState<string | null>("");

  const {
    data: { items: workAreas = [] } = { items: [] },
    isLoading: isLoadingWorkAreas,
  } = workAreasApi.useGetWorkAreasQuery(
    {
      name: query,
      cityId: selectedCity?.id,
    },
    { skip: !selectedCity?.id }
  );

  const handleSearch = useCallback((query: string | null) => {
    setQuery(query);
  }, []);

  const handleWorkAreaAction = (oldWorkArea?: TArea) => {
    openModal({
      name: "WORK_AREA_FORM_MODAL",
      props: {
        oldWorkAreaData: oldWorkArea,
      },
    });
  };

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      <WorkAreasAppBar
        handleSearch={handleSearch}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
      <WorkAreasLists
        handleEditWorkArea={(wa) => handleWorkAreaAction(wa)}
        workAreas={workAreas}
        isLoadingWorkAreas={isLoadingWorkAreas}
      />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleWorkAreaAction(),
          },
        ]}
      />
    </Stack>
  );
};

export default WorkAreas;
