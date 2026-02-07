import { type ComponentProps, type ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import STRINGS from '@/core/constants/strings.constant';
import { Info } from '@mui/icons-material';

function Nodata({
  title = STRINGS.no_data_found,
  subTitle,
  icon: Icon = Info,
  extra,
  iconSx,
}: {
  icon?: typeof Info;
  title?: string;
  subTitle?: string;
  extra?: ReactNode;
  iconSx?: ComponentProps<typeof Info>['sx'];
}) {
  return (
    <Stack sx={{ alignItems: 'center', my: 6 }}>
      <Icon
        sx={{
          fontSize: 60,
          color: 'text.disabled',
          ...iconSx,
        }}
      />
      <Typography variant="subtitle1" color="text.disabled" fontWeight="medium">
        {title}
      </Typography>
      {subTitle && (
        <Typography variant="subtitle2" color="text.disabled">
          {subTitle}
        </Typography>
      )}
      <Stack sx={{ mt: 1 }}>{extra}</Stack>
    </Stack>
  );
}

export default Nodata;
