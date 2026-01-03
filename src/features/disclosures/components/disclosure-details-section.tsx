import { Stack, Typography, Box, Button, Card } from '@mui/material';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import theme from '@/core/theme/index.theme';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { Link } from 'react-router-dom';
import CustomBadge from './custom-badge.component';

const DisclosureDetailsSection = ({
  details,
  disclosureId,
}: {
  details?: Record<string, any> | null;
  disclosureId?: string;
}) => {
  const hasNoDetails = !details || Object.keys(details).length === 0;

  if (hasNoDetails)
    return (
      <Card>
        <Nodata
          title={STRINGS.no_details}
          extra={
            <Link to={`/disclosures/details/action?disclosureId=${disclosureId}`}>
              <Button>{STRINGS.add}</Button>
            </Link>
          }
        />
      </Card>
    );

  return (
    <Card>
      <Header title={STRINGS.disclosures_details} />
      <Stack gap={3}>
        {Object.entries(details).map(([key, val]) => (
          <Stack key={key} gap={1}>
            <Card sx={{ px: 2, py: 0.5 }}>
              <Typography variant="subtitle1" textAlign="center">
                {STRINGS[key as keyof typeof STRINGS] ?? key}
              </Typography>
            </Card>
            <Typography variant="subtitle2" color="text.secondary">
              {val ? String(val) : STRINGS.none}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export default DisclosureDetailsSection;
