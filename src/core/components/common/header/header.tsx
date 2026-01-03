import theme from '@/core/theme/index.theme';
import type { Theme } from '@emotion/react';
import { Card, Stack, Typography, type SxProps } from '@mui/material';

function Header({ title, sx }: { title: string; sx?: SxProps<Theme> }) {
  return (
    <Card sx={{ width: '100%', p: 1, bgcolor: (theme) => theme.palette.grey[100], mb: 1, ...sx }}>
      <Typography variant="h6" textAlign="center">
        {title}
      </Typography>
    </Card>
  );
}

export default Header;
