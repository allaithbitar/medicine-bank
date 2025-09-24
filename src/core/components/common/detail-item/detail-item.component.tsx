import { memo, type ReactNode } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { deepPurple, green, red, blue, grey } from "@mui/material/colors";

const iconColorPresets = {
  blue: { bgcolor: blue[50], color: blue[600] },
  green: { bgcolor: green[50], color: green[600] },
  deepPurple: { bgcolor: deepPurple[50], color: deepPurple[600] },
  red: { bgcolor: red[50], color: red[600] },
};

interface IDetailItemProps {
  icon: ReactNode;
  label: string;
  iconColorPreset?: keyof typeof iconColorPresets;
  value: ReactNode;
  actions?: ReactNode;
  content?: ReactNode;
}

const DetailItem = ({
  icon,
  label,
  value,
  actions,
  iconColorPreset,
}: IDetailItemProps) => {
  return (
    <Box display="flex" alignItems="flex-start">
      <Avatar
        sx={{
          bgcolor:
            iconColorPreset && iconColorPresets[iconColorPreset]
              ? iconColorPresets[iconColorPreset].bgcolor
              : grey[100],
          color:
            iconColorPreset && iconColorPresets[iconColorPreset]
              ? iconColorPresets[iconColorPreset].color
              : grey[700],

          width: 36,
          height: 36,
          p: 0.5,
          mt: 0.5,
          mr: 1.5,
        }}
        variant="rounded"
      >
        {icon}
      </Avatar>
      <Box flexGrow={1}>
        <Typography
          variant="subtitle1"
          color="primary"
          sx={{ textTransform: "uppercase" }}
        >
          {label}
        </Typography>
        <Box display="flex" alignItems="center">
          {typeof value === "string" ? (
            <Typography variant="subtitle2" color="text.primary">
              {value}
            </Typography>
          ) : (
            value
          )}
          {actions}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(DetailItem);
