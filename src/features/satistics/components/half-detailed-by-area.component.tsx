import { Box, Stack, Typography, Divider } from '@mui/material';
import { cyan, grey } from '@mui/material/colors';
import type { THalfDetailedByAreaResult } from '../types/satistics.types';
import { HalfDetailed } from './half-detailed.component';
import Nodata from '@/core/components/common/no-data/no-data.component';
import MapIcon from '@mui/icons-material/Map';

type Props = {
  data: THalfDetailedByAreaResult;
};

export const HalfDetailedByArea = ({ data }: Props) => {
  const filteredAreas = data.filter((area) => area.count > 0);
  if (filteredAreas.length === 0) {
    return <Nodata icon={MapIcon} />;
  }

  return (
    <Stack spacing={4}>
      {filteredAreas.map((area, index) => (
        <Box key={area.areaId}>
          <Box
            sx={{
              backgroundColor: cyan[800],
              color: 'white',
              padding: 2,
              borderRadius: '3px',
              marginBottom: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              {area.areaName}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
              }}
            >
              {area.count}
            </Typography>
          </Box>
          <HalfDetailed data={area.details} />
          {index < filteredAreas.length - 1 && (
            <Divider
              sx={{
                marginTop: 4,
                borderColor: grey[300],
                borderWidth: 1,
              }}
            />
          )}
        </Box>
      ))}
    </Stack>
  );
};
