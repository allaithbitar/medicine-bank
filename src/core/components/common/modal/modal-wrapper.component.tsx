import { type ReactNode } from "react";
import { DialogActions, Modal, Card, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useModal } from "./modal-provider.component";
import type { TModalExtraProps } from "./modal-types";
import LoadingOverlay from "../loading-overlay/loading-overlay";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  height: "95dvh",
  border: "none",
};
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
    <Modal
      dir="rtl"
      open
      // maxWidth="md"
      // onClose={(_, reason) => {}}
    >
      <Card
        sx={{
          ...style,
          ...(isLoading && {
            pointerEvents: "none",
            userSelect: "none",
            overflow: "hidden",
          }),
        }}
      >
        <Stack sx={{ height: "100%", position: "relative" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              bgcolor: (theme) => theme.palette.primary.dark,
              color: (theme) => theme.palette.primary.contrastText,
              p: 1.5,
            }}
          >
            <Typography>{title}</Typography>
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
          </Stack>

          <Stack sx={{ flex: 1, overflow: "auto", p: 1, py: 2 }}>
            {children}
          </Stack>

          {actionButtons && (
            <DialogActions
              sx={{
                position: "sticky",
                bottom: 0,
                left: 0,
                width: "100%",
                p: 1,
                justifyContent: "flex-end",
                backgroundColor: "background.paper",
              }}
            >
              {actionButtons}
            </DialogActions>
          )}
          {isLoading && <LoadingOverlay />}
        </Stack>
      </Card>
    </Modal>
  );
};

export default ModalWrapper;
