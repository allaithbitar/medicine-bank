import { memo, type ReactNode } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import {
  deepPurple,
  green,
  red,
  orange,
  blue,
  grey,
} from "@mui/material/colors";

interface IDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  actions?: ReactNode;
}

const DetailItem = ({ icon, label, value, actions }: IDetailItemProps) => {
  const getColors = (itemLabel: string) => {
    switch (itemLabel) {
      case "Position":
        return { bgcolor: blue[50], color: blue[600] };
      case "Work Area":
        return { bgcolor: green[50], color: green[600] };
      case "Phone":
        return { bgcolor: deepPurple[50], color: deepPurple[600] };
      case "Password":
        return { bgcolor: red[50], color: red[600] };
      case "Confirm Password":
        return { bgcolor: orange[50], color: orange[600] };
      default:
        return { bgcolor: grey[50], color: grey[600] };
    }
  };

  const { bgcolor, color } = getColors(label);

  return (
    <Box display="flex" alignItems="flex-start" sx={{ mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: bgcolor,
          color: color,
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
          variant="caption"
          color="primary"
          sx={{ textTransform: "uppercase", fontWeight: "medium" }}
        >
          {label}
        </Typography>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ fontWeight: "medium", flexGrow: 1 }}
          >
            {value}
          </Typography>
          {actions}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(DetailItem);
