import { useCallback, useState } from "react";
import { Stack, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkAreasLists from "../../components/work-areas/work-area-lists/work-area-lists.component";
import WorkAreasAppBar from "../../components/work-areas/work-area-hidder/work-area-hidder.components";
import workAreasApi from "../../api/work-areas/work-areas.api";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { IWorkArea } from "../../types/work-areas.types";

const WorkAreaManagement = () => {
  const { openModal } = useModal();
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [query, setQuery] = useState<string | null>("");

  const {
    data: { items: workAreas = [] } = { items: [] },
    isLoading: isLoadingWorkAreas,
  } = workAreasApi.useGetWorkAreasQuery(
    {
      name: query,
      cityId: selectedCityId,
    },
    { skip: !selectedCityId },
  );

  const handleSearch = useCallback((query: string | null) => {
    setQuery(query);
  }, []);

  const handleWorkAreaAction = (oldWorkArea?: IWorkArea) => {
    openModal({
      name: "WORK_AREA_FORM_MODAL",
      props: {
        oldWorkArea,
        defaultSelectedCity: selectedCityId,
      },
    });
  };

  return (
    <Stack gap={2}>
      {isLoadingWorkAreas && <LoadingOverlay />}
      <WorkAreasAppBar
        handleSearch={handleSearch}
        selectedCityId={selectedCityId}
        setSelectedCityId={setSelectedCityId}
      />
      <WorkAreasLists
        handleEditWorkArea={(wa) => handleWorkAreaAction(wa)}
        workAreas={workAreas}
        isLoadingWorkAreas={isLoadingWorkAreas}
      />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => handleWorkAreaAction()}
      >
        <AddIcon />
      </Fab>
    </Stack>
  );
};

export default WorkAreaManagement;
