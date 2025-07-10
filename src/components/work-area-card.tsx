import { useCallback } from "react";
import type { WorkArea } from "../pages/banks/workAreas";
import { openModal } from "../utils/helpers";
import { Grid } from "@mui/material";
import WorkAreaCard from "./workAreaCard";
import Nodata from "./common/nodata";
import { Business as BuildingOfficeIcon } from "@mui/icons-material";
const workAreas: WorkArea[] = [
  {
    id: "1",
    name: "street 1",
    city: "aleppo",
    employeeCount: 1,
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "street 2",
    city: "aleppo",
    employeeCount: 1,
    createdDate: "2024-01-20",
  },
];

const WorkAreasCards = () => {
  const handleEditWorkArea = useCallback((id: string) => {
    console.log("🚀 ~ handleEditWorkArea ~ id:", id);
  }, []);

  const handleDeleteWorkAreaClick = useCallback((id: string) => {
    openModal("confirmation", {
      message: "Are you sure you want to delete this item?",
      onConfirm: () => {
        console.log("🚀 ~ handleDeleteWorkAreaClick ~ id:", id);
      },
    });
  }, []);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {workAreas.map((wa) => (
          <Grid key={wa.id}>
            <WorkAreaCard
              workArea={wa}
              onEdit={() => handleEditWorkArea(wa.id)}
              onDelete={() => handleDeleteWorkAreaClick(wa.id)}
            />
          </Grid>
        ))}
      </Grid>
      {workAreas.length === 0 && (
        <Nodata
          icon={<BuildingOfficeIcon />}
          title="No work areas found"
          subTitle="Add some work areas to see them."
        />
      )}
    </>
  );
};
export default WorkAreasCards;
