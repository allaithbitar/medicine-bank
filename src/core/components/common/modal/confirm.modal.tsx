import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import type { ModalPropsMap, ModalSeverity } from "./modal-types";
import { showError } from "../toast/toast";

type ConfirmModalProps = ModalPropsMap["confirmation"] & {
  _close: () => void;
};

const getSeverityIcon = (
  severity: ModalSeverity | undefined,
  color: string
) => {
  const fontSize = 30;
  switch (severity) {
    case "info":
      return <InfoOutlinedIcon sx={{ color, fontSize }} />;
    case "warning":
      return <WarningOutlinedIcon sx={{ color, fontSize: fontSize }} />;
    case "error":
      return <ErrorOutlineOutlinedIcon sx={{ color, fontSize }} />;
    case "success":
      return <CheckCircleOutlineOutlinedIcon sx={{ color, fontSize }} />;
    default:
      return null;
  }
};

const ConfirmModal = ({
  title = "Confirm Action",
  message,
  description,
  severity = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  _close,
}: ConfirmModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await Promise.resolve(onConfirm());
      _close();
    } catch (error) {
      console.log("🚀 ~ handleConfirm ~ error:", error);
      showError("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    _close();
  };

  const confirmButtonColor = severity === "error" ? "error" : "primary";
  const iconColor =
    severity === "error"
      ? "error.main"
      : severity === "warning"
      ? "warning.main"
      : severity === "success"
      ? "success.main"
      : "info.main";

  const isConfirmDisabled = isLoading;

  return (
    <Dialog
      open
      onClose={_close}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: iconColor,
          }}
        >
          {getSeverityIcon(severity, iconColor)}
          <Typography
            variant="h6"
            component="span"
            sx={{ color: "text.primary" }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="confirmation-dialog-description" paragraph>
          {message}
        </DialogContentText>
        {description && (
          <DialogContentText variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          color={confirmButtonColor}
          variant="contained"
          disabled={isConfirmDisabled}
          endIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
