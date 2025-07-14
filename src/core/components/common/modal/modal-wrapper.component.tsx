import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useModal } from "./modal-provider.component";
import type { TModalExtraProps } from "./modal-types";
import LoadingOverlay from "../loading-overlay/loading-overlay";
const ModalWrapper = ({
  children,
  title,
  isLoading,
  actionButtons,
  modalId,
  disableClosing,
  onClose,
}: {
  children: ReactNode;
  title?: string;
  isLoading?: boolean;
  actionButtons?: ReactNode;
  disableClosing?: boolean;
  onClose?: VoidFunction;
} & TModalExtraProps) => {
  const { closeModal } = useModal();

  const handleClose = () => {
    if (!disableClosing) {
      closeModal(modalId);
      onClose?.();
    }
  };

  return (
    <Dialog
      dir="rtl"
      open
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby={`modal-title-${modalId}`}
      slotProps={{
        paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            gap: 0,
            overflow: "hidden",
            borderRadius: 1,
            padding: 0,
            width: { xs: "100%", sm: "100%", xxl: "40dvh" },
          },
        },
      }}
    >
      <DialogTitle
        id={`modal-title-${modalId}`}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          p: 2,
        }}
      >
        <Box sx={{ py: 0 }}>{title}</Box>
        {!disableClosing && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "primary.contrastText",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          padding: 2,
          width: "auto",
          maxHeight: "90dvh",
          ...(isLoading && {
            pointerEvents: "none",
            userSelect: "none",
            overflow: "hidden",
          }),
        }}
      >
        {children}
        {isLoading && (
          <LoadingOverlay sx={{ position: "fixed", top: "52px" }} />
        )}
      </DialogContent>
      {actionButtons && (
        <DialogActions
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 1.5,
            justifyContent: "flex-end",
            backgroundColor: "background.paper",
          }}
        >
          {actionButtons}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalWrapper;
