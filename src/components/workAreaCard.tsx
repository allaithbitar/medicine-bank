import { memo } from "react";
import { Avatar, Box, Typography, Tooltip, Stack } from "@mui/material";
import {
  Business as BuildingOfficeIcon,
  Work as BriefcaseIcon,
  Group as UsersIcon,
  Edit as PencilIcon,
  Delete as TrashIcon,
} from "@mui/icons-material";
import CustomIconButton from "./common/customIconButton";
import DetailItem from "./common/detailItem";
import ReusableCard from "./common/reusableCard";
import type { WorkArea } from "../pages/banks/workAreas";

interface WorkAreaCardProps {
  workArea: WorkArea;
  onEdit: (workArea: WorkArea) => void;
  onDelete: (id: string) => void;
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
          <CustomIconButton onClick={() => onEdit(workArea)} size="small">
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
          <CustomIconButton
            onClick={() => onDelete(workArea.id)}
            disabled={workArea.employeeCount > 0}
            size="small"
          >
            <TrashIcon
              sx={{
                fontSize: 20,
                color: workArea.employeeCount > 0 ? "grey.400" : "white",
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
        icon={<BriefcaseIcon fontSize="small" />}
        label="Description"
        value={workArea.description || "No description provided"}
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
      <Typography variant="body2" sx={{ color: "success.light", ml: 7 }}>
        Area ID: {workArea.id}
      </Typography>
    </Box>
  );

  const footerContent = (
    <>
      <Typography variant="caption" sx={{ color: "grey.500" }}>
        {workArea.employeeCount > 0 ? "Has employees" : "No employees assigned"}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: workArea.employeeCount > 0 ? "success.main" : "grey.400",
          }}
        ></Box>
        <Typography variant="caption" sx={{ color: "grey.500" }}>
          {workArea.employeeCount > 0 ? "Active" : "Inactive"}
        </Typography>
      </Box>
    </>
  );

  return (
    <ReusableCard
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={footerContent}
      cardSx={{
        height: "100%",
      }}
    />
  );
};

export default memo(WorkAreaCard);
