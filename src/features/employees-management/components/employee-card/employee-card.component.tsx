import { memo } from "react";
import { Avatar, Box, Typography, Tooltip, Stack } from "@mui/material";
import {
  Visibility as EyeIcon,
  VisibilityOff as EyeSlashIcon,
  Person as UserIcon,
  Phone as PhoneIcon,
  Work as BriefcaseIcon,
  Business as BuildingOfficeIcon,
  Key as KeyIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import type { TEmployeeAccount } from "@/features/accounts-forms/types/employee.types";
import CustomIconButton from "@/core/components/common/custom-icon-button/custom-icon-button.component";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";

interface IEmployeeCardProps {
  employee: TEmployeeAccount;
  isVisible: boolean;
  onToggleVisibility: (id: string) => void;
  maskPassword: (password: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeCard = ({
  employee,
  isVisible,
  // onToggleVisibility,
  maskPassword,
  onDelete,
  onEdit,
}: IEmployeeCardProps) => {
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
          <UserIcon sx={{ color: "white" }} />
        </Avatar>
        <Typography
          variant="h6"
          component="div"
          color="white"
          fontWeight="semibold"
          noWrap
          sx={{ flexShrink: 1, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {employee.name}
        </Typography>
      </Box>

      <Stack
        direction="row"
        gap={1}
        sx={{ color: "white", flexShrink: 0, ml: 2 }}
      >
        <Tooltip title="Delete Employee" arrow>
          <CustomIconButton onClick={onDelete} size="small">
            <DeleteOutlineIcon sx={{ color: "white", fontSize: 20 }} />
          </CustomIconButton>
        </Tooltip>
        <Tooltip title="Edit Employee" arrow>
          <CustomIconButton onClick={onEdit} size="small">
            <EditIcon sx={{ color: "white", fontSize: 20 }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  const bodyContent = (
    <>
      <DetailItemComponent
        icon={<BriefcaseIcon fontSize="small" />}
        label="Position"
        value={employee.role}
      />
      <DetailItemComponent
        icon={<BuildingOfficeIcon fontSize="small" />}
        label="Work Area"
        value={employee.workArea}
      />
      <DetailItemComponent
        icon={<PhoneIcon fontSize="small" />}
        label="Phone"
        value={employee.phone}
      />
      <DetailItemComponent
        icon={<KeyIcon fontSize="small" />}
        label="Password"
        value={isVisible ? employee.password : maskPassword(employee.password)}
        actions={
          <CustomIconButton
            // onClick={() => (employee.id ? onToggleVisibility(employee.id) : {})}
            size="small"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? (
              <EyeSlashIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            ) : (
              <EyeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            )}
          </CustomIconButton>
        }
      />
    </>
  );

  const footerContent = (
    <Typography variant="caption" color="text.secondary">
      Last updated: Today
    </Typography>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={footerContent}
    />
  );
};

export default memo(EmployeeCard);
