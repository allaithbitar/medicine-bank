import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  CircularProgress,
} from '@mui/material';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import disclosuresApi from '../api/disclosures.api';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';

type TArchiveDisclosureModalProps = {
  disclosureId: string;
  oldArchiveNumber: string | null;
};

const ArchiveDisclosureModal = ({ disclosureId, oldArchiveNumber }: TArchiveDisclosureModalProps) => {
  const { closeModal } = useModal();
  const [archiveNumber, setArchiveNumber] = useState<string>(oldArchiveNumber || '');
  const [archiveDisclosure, { isLoading }] = disclosuresApi.useArchiveDisclosureMutation();

  const handleConfirm = async () => {
    try {
      await archiveDisclosure({
        id: disclosureId,
        archiveNumber: archiveNumber || undefined,
      }).unwrap();
      notifySuccess(STRINGS.action_done_successfully);
      closeModal();
    } catch (error: any) {
      notifyError(error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Dialog
      dir="rtl"
      open
      maxWidth="sm"
      fullWidth
      onClose={() => {
        if (!isLoading) closeModal();
      }}
    >
      <DialogTitle>{STRINGS.archive_disclosure}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <DialogContentText>{STRINGS.archive_confirmation}</DialogContentText>
          <FormTextFieldInput
            label={STRINGS.archive_number_optional}
            value={archiveNumber}
            onChange={(v) => setArchiveNumber(v)}
            disabled={isLoading}
            placeholder={STRINGS.archive_number_optional}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={isLoading} variant="outlined">
          {STRINGS.cancel}
        </Button>
        <Button
          onClick={handleConfirm}
          color="warning"
          variant="contained"
          disabled={isLoading}
          endIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {STRINGS.archive}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveDisclosureModal;
