import useScreenSize from '@/core/hooks/use-screen-size.hook';
import { Add, MoreHoriz } from '@mui/icons-material';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import type { ReactNode } from 'react';

type TProps = {
  actions: {
    label: string;
    icon: ReactNode;
    onClick?: () => void;
  }[];
  icon?: ReactNode;
};

const ActionsFab = ({ icon, actions }: TProps) => {
  const { isTablet } = useScreenSize();
  return (
    <SpeedDial
      ariaLabel=""
      sx={{
        position: 'fixed',
        right: 15,
        bottom: 15,
        zIndex: 998,
        ...(isTablet
          ? {
              left: '50%',
              transform: 'translateX(-50%)',
            }
          : {}),
      }}
      icon={icon || <MoreHoriz />}
    >
      {actions.map((a) => (
        <SpeedDialAction
          onClick={a.onClick}
          key={a.label}
          icon={a.icon ?? <Add />}
          slotProps={{
            tooltip: {
              open: true,
              title: a.label,
            },
            staticTooltipLabel: { sx: { textWrap: 'nowrap' } },
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default ActionsFab;
