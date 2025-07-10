import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { ModalPropsMap } from "./modal";

type ConfirmModalProps = ModalPropsMap["confirmation"] & {
  _close: () => void;
};

const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  _close,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    _close();
  };

  const handleCancel = () => {
    onCancel?.();
    _close();
  };

  return (
    <Dialog open onClose={_close}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
