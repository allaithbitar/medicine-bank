import { memo } from "react";
import { Avatar, Box, Typography, Tooltip, Stack } from "@mui/material";
import {
  Business as BuildingOfficeIcon,
  Group as UsersIcon,
  Edit as PencilIcon,
  Delete as TrashIcon,
} from "@mui/icons-material";
import type { WorkArea } from "../pages/banks/work-areas-management.page";
import CustomIconButton from "./common/custom-icon-button.component";
import DetailItem from "./common/detail-item.component";
import ReusableCard from "./common/reusable-card.component";
import LocationCityIcon from "@mui/icons-material/LocationCity";

interface WorkAreaCardProps {
  workArea: WorkArea;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkAreaCard = ({ workArea, onEdit, onDelete }: WorkAreaCardProps) => {
  const headerContent = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", flexGrow: 1, minWidth: 0 }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <BuildingOfficeIcon sx={{ color: "white" }} />
        </Avatar>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: "semibold",
            color: "white",
            flexShrink: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          noWrap
        >
          {workArea.name}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{ color: "white", flexShrink: 0, ml: 2 }}
      >
        <Tooltip title="Edit work area">
          <CustomIconButton onClick={onEdit} size="small">
            <PencilIcon sx={{ fontSize: 20, color: "white" }} />
          </CustomIconButton>
        </Tooltip>
        <Tooltip
          title={
            workArea.employeeCount > 0
              ? "Cannot delete: employees assigned"
              : "Delete work area"
          }
        >
          <CustomIconButton onClick={onDelete} size="small">
            <TrashIcon
              sx={{
                fontSize: 20,
                color: "white",
              }}
            />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  const bodyContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <DetailItem
        icon={<LocationCityIcon fontSize="small" />}
        label="city"
        value={workArea.city}
      />
      <DetailItem
        icon={<UsersIcon fontSize="small" />}
        label="Employees"
        value={`${workArea.employeeCount} assigned`}
      />
      <DetailItem
        icon={<BuildingOfficeIcon fontSize="small" />}
        label="Created"
        value={new Date(workArea.createdDate).toLocaleDateString()}
      />
    </Box>
  );

  return (
    <ReusableCard
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={null}
    />
  );
};

export default memo(WorkAreaCard);
