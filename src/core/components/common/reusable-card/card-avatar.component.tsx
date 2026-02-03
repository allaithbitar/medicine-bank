import { Person } from '@mui/icons-material';
import { Avatar, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import CustomIconButton from '../custom-icon-button/custom-icon-button.component';

type TCardAvatarProps = {
  name?: string;
  subLabel?: string;
  actions?: [
    {
      icon: ReactNode;
      onClick?: () => void;
    },
  ];
  icon?: ReactNode;
  extras?: ReactNode;
};

const CardAvatar = ({ name, subLabel, icon, actions, extras }: TCardAvatarProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        paddingInlineStart: 1,
        width: '100%',
      }}
    >
      <Avatar
        sx={{
          bgcolor: 'rgba(255,255,255,0.2)',
          mr: 1,
        }}
      >
        {icon || <Person sx={{ color: 'white' }} />}
      </Avatar>
      <Stack sx={{ flex: 1, overflow: 'auto' }}>
        <Typography color="white" noWrap sx={{ textOverflow: 'ellipsis', flex: 1 }}>
          {name}
        </Typography>
        {subLabel && (
          <Typography variant="caption" color="white" noWrap sx={{ textOverflow: 'ellipsis' }}>
            {subLabel}
          </Typography>
        )}
      </Stack>
      {actions?.map((a, i) => (
        <CustomIconButton key={i} onClick={a.onClick}>
          {a.icon}
        </CustomIconButton>
      ))}
      {extras}
    </Stack>
  );
};

export default CardAvatar;
