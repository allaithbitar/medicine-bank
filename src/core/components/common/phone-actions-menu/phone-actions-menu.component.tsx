import { memo, useCallback } from 'react';
import { Stack, Typography, IconButton, Box } from '@mui/material';
import { Phone, Message, ContentCopy } from '@mui/icons-material';
import { sanitizePhoneForTel } from '@/core/helpers/helpers';
import { notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';

interface IPhoneActionsMenuProps {
  phone: string;
  showWhatsApp?: boolean;
  compact?: boolean;
}

const PhoneActionsMenu = ({ phone, showWhatsApp = false, compact = false }: IPhoneActionsMenuProps) => {
  const tel = sanitizePhoneForTel(phone);

  const handleCall = useCallback(() => {
    window.location.href = `tel:${tel}`;
  }, [tel]);

  const handleSMS = useCallback(() => {
    window.location.href = `sms:${tel}`;
  }, [tel]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(phone);
      notifySuccess(STRINGS.copied_to_clipboard);
    } catch (error) {
      console.error('Failed to copy phone number:', error);
    }
  }, [phone]);

  const handleWhatsApp = useCallback(() => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  }, [phone]);

  if (compact) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography variant="subtitle2" component="span">
          {phone}
        </Typography>
        <IconButton size="small" onClick={handleCall} title={STRINGS.call} sx={{ p: 0.5 }}>
          <Phone fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleSMS} title={STRINGS.send_message} sx={{ p: 0.5 }}>
          <Message fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleCopy} title={STRINGS.copy} sx={{ p: 0.5 }}>
          <ContentCopy fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      <Typography variant="subtitle2" component="span" sx={{ minWidth: 'fit-content' }}>
        {phone}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" onClick={handleCall} title={STRINGS.call} color="primary">
          <Phone fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleSMS} title={STRINGS.send_message} color="primary">
          <Message fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleCopy} title={STRINGS.copy} color="primary">
          <ContentCopy fontSize="small" />
        </IconButton>
        {showWhatsApp && (
          <IconButton size="small" onClick={handleWhatsApp} title="WhatsApp" color="success">
            <Phone fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(PhoneActionsMenu);
