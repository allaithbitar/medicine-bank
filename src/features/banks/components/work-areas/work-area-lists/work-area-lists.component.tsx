import { useCallback } from "react";
import { Grid } from "@mui/material";
import { Business as BuildingOfficeIcon } from "@mui/icons-material";
import WorkAreaCardComponent from "../work-area-card/work-area-card.component";
import Nodata from "@/core/components/common/no-data/no-data.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TArea } from "@/features/banks/types/work-areas.types";

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
      <Grid container gap={2} justifyContent="center">
        {workAreas.map((wa) => (
          <Grid key={wa.id}>
            <WorkAreaCardComponent
              workArea={wa}
              onEdit={() => handleEditWorkArea(wa)}
              onDelete={() => handleDeleteWorkAreaClick(wa.id)}
            />
          </Grid>
        ))}
      </Grid>
      {!isLoadingWorkAreas && workAreas.length === 0 && (
        <Nodata
          icon={BuildingOfficeIcon}
          title="No work areas found"
          subTitle="Add some work areas to see them."
        />
      )}
    </>
  );
};
export default WorkAreasLists;
