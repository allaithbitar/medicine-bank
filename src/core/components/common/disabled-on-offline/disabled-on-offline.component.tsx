import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { WifiOff } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';

const DisabledOnOffline = ({ children }: { children: ReactNode }) => {
  const isOffline = useIsOffline();

  if (!isOffline) return children;

  return (
    <Stack sx={{ height: '100%' }}>
      <Stack
        sx={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: (theme) => theme.palette.text.disabled,
        }}
      >
        <WifiOff sx={{ fontSize: 100 }} />
        <Typography>{STRINGS.disabled_on_offline}</Typography>
      </Stack>
    </Stack>
  );
};

export default DisabledOnOffline;
