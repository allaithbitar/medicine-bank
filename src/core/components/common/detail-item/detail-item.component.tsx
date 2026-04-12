import { memo, type ReactNode, useCallback } from 'react';
import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { deepPurple, green, red, blue, grey } from '@mui/material/colors';
import { notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';

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
  copyText?: string | null;
}

const DetailItem = ({ icon, label, value, actions, iconColorPreset, copyText }: IDetailItemProps) => {
  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!copyText || copyText === STRINGS.none) return;
      try {
        await navigator.clipboard.writeText(copyText);
        notifySuccess(STRINGS.copied_to_clipboard);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    },
    [copyText]
  );
  return (
    <Box display="flex" alignItems="flex-start">
      <Avatar
        sx={{
          bgcolor:
            iconColorPreset && iconColorPresets[iconColorPreset]
              ? iconColorPresets[iconColorPreset].bgcolor
              : grey[100],
          color:
            iconColorPreset && iconColorPresets[iconColorPreset] ? iconColorPresets[iconColorPreset].color : grey[700],

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
        <Typography variant="subtitle1" color="primary" sx={{ textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Box display="flex" alignItems="center">
          {typeof value === 'string' ? (
            <Typography variant="subtitle2" color="text.primary">
              {value}
            </Typography>
          ) : (
            value
          )}
          {actions}
          {copyText && copyText !== STRINGS.none && (
            <IconButton size="small" onClick={handleCopy} title={STRINGS.copy} sx={{ ml: 1 }} color="primary">
              <ContentCopy fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(DetailItem);
