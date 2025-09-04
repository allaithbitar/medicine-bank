import { useCallback } from "react";
import { Business as BuildingOfficeIcon } from "@mui/icons-material";
import WorkAreaCardComponent from "../work-area-card/work-area-card.component";
import Nodata from "@/core/components/common/no-data/no-data.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TArea } from "@/features/banks/types/work-areas.types";
import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";
import STRINGS from "@/core/constants/strings.constant";

interface IWorkAreasLists {
  workAreas: TArea[];
  isLoadingWorkAreas: boolean;
  handleEditWorkArea: (workArea: TArea) => void;
}

const WorkAreasLists = ({
  workAreas,
  isLoadingWorkAreas,
  handleEditWorkArea,
}: IWorkAreasLists) => {
  const { openModal } = useModal();

  const handleDeleteWorkAreaClick = useCallback((id: string) => {
    openModal({
      name: "CONFIRM_MODAL",
      props: {
        message: "Are you sure you want to delete this item?",
        onConfirm: () => {
          console.log("🚀 ~ handleDeleteWorkAreaClick ~ id:", id);
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoadingWorkAreas && workAreas.length === 0 && (
        <Nodata
          icon={BuildingOfficeIcon}
          title={STRINGS.no_work_areas_found}
          subTitle={STRINGS.add_to_see}
        />
      )}
      <VirtualizedList
        isLoading={isLoadingWorkAreas}
        items={workAreas}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: workAreas.length,
        }}
      >
        {({ item: wa }) => {
          return (
            <WorkAreaCardComponent
              workArea={wa}
              onEdit={() => handleEditWorkArea(wa)}
              onDelete={() => handleDeleteWorkAreaClick(wa.id)}
            />
          );
        }}
      </VirtualizedList>
    </>
  );
};
export default WorkAreasLists;
