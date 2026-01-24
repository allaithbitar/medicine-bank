import { Business as BuildingOfficeIcon } from "@mui/icons-material";
import WorkAreaCardComponent from "../work-area-card/work-area-card.component";
import Nodata from "@/core/components/common/no-data/no-data.component";
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
            />
          );
        }}
      </VirtualizedList>
    </>
  );
};
export default WorkAreasLists;
