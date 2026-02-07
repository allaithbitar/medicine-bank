import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface IInfoItemProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

const InfoItem = ({ icon, label, value }: IInfoItemProps) => (
  <Stack direction="row" gap={1} alignItems="flex-start">
    <Box
      sx={{
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        mt: 0.5,
      }}
    >
      {icon}
    </Box>
    <Stack gap={0.25} flex={1}>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="medium">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export default InfoItem;
