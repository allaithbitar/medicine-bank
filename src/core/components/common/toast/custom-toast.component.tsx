import hotToast, { type Toast } from "react-hot-toast";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface ICustomToastProps {
  t: Toast;
  message: string;
  type: "success" | "error" | "info" | "loading" | "default";
}

const CustomToast = ({ t, message, type }: ICustomToastProps) => {
  let iconComponent: ReactNode | null = null;
  let snackbarBgColor: string;
  let textColor: string = "#fff";

  switch (type) {
    case "success":
      iconComponent = <CheckCircleOutlineIcon sx={{ color: "success.main" }} />;
      snackbarBgColor = "#e8f5e9";
      textColor = "#2e7d32";
      break;
    case "error":
      iconComponent = <ErrorOutlineIcon sx={{ color: "error.main" }} />;
      snackbarBgColor = "#ffebee";
      textColor = "#d32f2f";
      break;
    case "info":
      iconComponent = <InfoOutlinedIcon sx={{ color: "info.main" }} />;
      snackbarBgColor = "#e3f2fd";
      textColor = "#0288d1";
      break;
    case "loading":
      iconComponent = <CircularProgress size={20} color="primary" />;
      snackbarBgColor = "#e0f2f7";
      textColor = "#01579b";
      break;
    case "default":
    default:
      iconComponent = null; //  <NotificationsIcon sx={{ color: 'grey.700' }} />
      snackbarBgColor = "#f5f5f5";
      textColor = "#212121";
      break;
  }

  const action = t.duration !== Infinity && (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => hotToast.dismiss(t.id)}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Stack
      sx={{
        opacity: t.visible ? 1 : 0,
        transform: `translateY(${t.visible ? 0 : 20}px)`,
        transition: "all 0.3s ease-out",
        minWidth: "280px",
        borderRadius: 1,
      }}
    >
      <SnackbarContent
        sx={{
          bgcolor: snackbarBgColor,
          color: textColor,
        }}
        message={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {iconComponent}
            <Typography variant="body2" sx={{ color: textColor }}>
              {message}
            </Typography>
          </Box>
        }
        action={action}
      />
    </Stack>
  );
};

export default CustomToast;
