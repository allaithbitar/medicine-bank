import STRINGS from '@/core/constants/strings.constant';
import { useAppRuntimeTypeContext } from '@/core/context/app-runtime-type.context';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Box, Button, Divider, List, ListItemButton, ListItemText, Menu, Stack, Typography } from '@mui/material';
import { useState } from 'react';

const RuntimeToggle = () => {
  const { type, setType } = useAppRuntimeTypeContext();
  const isOffline = useIsOffline();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClose = (_type: typeof type) => {
    setType(_type);
    setAnchorEl(null);
  };
  return (
    <Stack sx={{ flexShrink: 0 }}>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <List disablePadding sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItemButton alignItems="center" onClick={() => handleClose('automatic')} sx={{ gap: 1 }}>
            {type === 'automatic' ? (
              <RadioButtonChecked sx={{ color: (theme) => theme.palette.primary.main }} />
            ) : (
              <RadioButtonUnchecked sx={{ color: (theme) => theme.palette.text.secondary }} />
            )}
            <ListItemText
              id="automatic"
              primary={STRINGS.runtime_automatic}
              secondary={
                <Typography component="span" variant="subtitle2" sx={{ color: 'text.disabled', display: 'inline' }}>
                  {STRINGS.runtime_automatic_description}
                </Typography>
              }
            />
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton alignItems="center" onClick={() => handleClose('online')} sx={{ gap: 1 }}>
            {type === 'online' ? (
              <RadioButtonChecked sx={{ color: (theme) => theme.palette.primary.main }} />
            ) : (
              <RadioButtonUnchecked sx={{ color: (theme) => theme.palette.text.secondary }} />
            )}

            <ListItemText
              id="automatic"
              primary={STRINGS.runtime_online}
              secondary={
                <Typography component="span" variant="subtitle2" sx={{ color: 'text.disabled', display: 'inline' }}>
                  {STRINGS.runtime_online_description}
                </Typography>
              }
            />
          </ListItemButton>

          <Divider component="li" />
          <ListItemButton alignItems="center" onClick={() => handleClose('offline')} sx={{ gap: 1 }}>
            {type === 'offline' ? (
              <RadioButtonChecked sx={{ color: (theme) => theme.palette.primary.main }} />
            ) : (
              <RadioButtonUnchecked sx={{ color: (theme) => theme.palette.text.secondary }} />
            )}

            <ListItemText
              id="automatic"
              primary={STRINGS.runtime_offline}
              secondary={
                <Typography component="span" variant="subtitle2" sx={{ color: 'text.disabled', display: 'inline' }}>
                  {STRINGS.runtime_offline_description}
                </Typography>
              }
            />
          </ListItemButton>
        </List>
      </Menu>
      <Button size="small" variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Stack direction="row" gap={1} alignItems="center">
          <Typography fontSize="inherit">
            {STRINGS[`runtime_${type}`]}{' '}
            {type === 'automatic' && `( ${isOffline ? STRINGS.runtime_offline : STRINGS.runtime_online} )`}
          </Typography>
          <Box
            sx={{
              width: 8,
              aspectRatio: '1/1',
              borderRadius: '100%',
              ...((type === 'online' || !isOffline) && {
                bgcolor: (theme) => theme.palette.success.main,
              }),
              ...((type === 'offline' || isOffline) && {
                bgcolor: (theme) => theme.palette.warning.main,
              }),
            }}
          />
        </Stack>
      </Button>
    </Stack>
  );
};

export default RuntimeToggle;
