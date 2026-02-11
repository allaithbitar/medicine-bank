import { AppBar, Toolbar, Typography, Stack, Box, type AppBarProps, type ToolbarProps } from '@mui/material';
import { memo, type ReactNode } from 'react';

interface ICustomAppBarProps extends AppBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  toolbarSx?: ToolbarProps['sx'];
}

const CustomAppBar = ({ title, subtitle, actions, children, toolbarSx, ...appBarProps }: ICustomAppBarProps) => {
  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderRadius: 1, py: children ? 1 : 0 }}
      elevation={0}
      {...appBarProps}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          px: '16px !important',
          ...toolbarSx,
        }}
      >
        <Stack
          sx={{
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h5" color="textSecondary" component="h3">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
        </Stack>

        {children && <Box sx={{ width: '100%', mt: children ? 1 : 0 }}>{children}</Box>}
      </Toolbar>
    </AppBar>
  );
};

export default memo(CustomAppBar);
