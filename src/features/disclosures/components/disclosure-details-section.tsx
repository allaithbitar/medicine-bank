import { Stack, Typography, Button, Card } from '@mui/material';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { Link } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';

const DisclosureDetailsSection = ({
  details,
  disclosureId,
  openEditDetails,
}: {
  details?: Record<string, any> | null;
  disclosureId?: string;
  openEditDetails: () => void;
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

  const getDetailsValue = (val: any) => {
    if (!val) return STRINGS.none;
    if (typeof val === 'object') return val?.label || STRINGS.none;
    return String(val);
  };

  return (
    <Card>
      <Header title={STRINGS.disclosures_details} />
      <Stack gap={3} sx={{ pb: 6 }}>
        {Object.entries(details).map(([key, val]) => (
          <Stack key={key} gap={1}>
            <Card sx={{ px: 2, py: 0.5 }}>
              <Typography variant="subtitle1" textAlign="center">
                {STRINGS[key as keyof typeof STRINGS] ?? key}
              </Typography>
            </Card>
            <Typography variant="subtitle2" color="text.secondary">
              {getDetailsValue(val)}
            </Typography>
          </Stack>
        ))}
        <Button fullWidth startIcon={<ListAltIcon />} onClick={openEditDetails}>
          {STRINGS.edit} {STRINGS.disclosures_details}
        </Button>
      </Stack>
    </Card>
  );
};

export default DisclosureDetailsSection;
