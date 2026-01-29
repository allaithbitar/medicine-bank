import useScreenSize from '@/core/hooks/use-screen-size.hook';
import { Fab } from '@mui/material';
import type { ComponentProps, ReactNode } from 'react';

const ActionFab = ({ icon, ...props }: { icon: ReactNode } & ComponentProps<typeof Fab>) => {
  const { isTablet } = useScreenSize();
  return (
    <Fab
      {...props}
      sx={{
        position: 'fixed',
        right: 15,
        bottom: 15,
        zIndex: 998,
        ...props.sx,
        ...(isTablet
          ? {
              left: '50%',
              transform: 'translateX(-50%)',
            }
          : {}),
      }}
    >
      {icon}
    </Fab>
  );
};

export default ActionFab;
