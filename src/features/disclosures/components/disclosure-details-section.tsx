import { Stack, Typography, Button, Card } from '@mui/material';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { Link } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import { Home, Work, ElectricBolt, AttachMoney, MedicalServices, ThumbUp, ThumbDown, Info } from '@mui/icons-material';
import { getStringsLabel } from '@/core/helpers/helpers';
import { useDisclosureDetailsLoader } from '../hooks/disclosure-details-loader.hook';

const DisclosureDetailsSection = ({
  disclosureId,
  openEditDetails,
}: {
  disclosureId?: string;
  openEditDetails?: () => void;
}) => {
  const { data: details, isFetching } = useDisclosureDetailsLoader(disclosureId!);

  if (isFetching) {
    return (
      <Card sx={{ position: 'relative', minHeight: 200 }}>
        <LoadingOverlay />
      </Card>
    );
  }

  const hasNoDetails = !details;

  if (hasNoDetails) {
    return (
      <Card>
        <Nodata
          title={STRINGS.no_details}
          extra={
            openEditDetails ? (
              <Link to={`/disclosures/details/action?disclosureId=${disclosureId}`}>
                <Button>{STRINGS.add}</Button>
              </Link>
            ) : null
          }
        />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', overflow: 'auto' }}>
      <Stack gap={1}>
        <Header title={STRINGS.disclosures_details} />
        <Stack gap={2}>
          {details.diseasesOrSurgeries && (
            <DetailItemComponent
              icon={<MedicalServices />}
              iconColorPreset="red"
              label={STRINGS.diseases_or_surgeries}
              value={details.diseasesOrSurgeries}
            />
          )}

          {details.jobOrSchool && (
            <DetailItemComponent
              icon={<Work />}
              iconColorPreset="blue"
              label={STRINGS.job_or_school}
              value={details.jobOrSchool}
            />
          )}

          {details.houseOwnership && (
            <DetailItemComponent
              icon={<Home />}
              iconColorPreset="green"
              label={STRINGS.house_ownership}
              value={
                <Stack gap={0.5}>
                  <Typography variant="subtitle2">
                    {getStringsLabel({ key: 'house_ownership', val: details.houseOwnership })}
                  </Typography>
                  {details.houseOwnershipNote && (
                    <Typography variant="body2" color="text.secondary">
                      {STRINGS.note}: {details.houseOwnershipNote}
                    </Typography>
                  )}
                </Stack>
              }
            />
          )}

          {details.electricity && (
            <DetailItemComponent
              icon={<ElectricBolt />}
              iconColorPreset="deepPurple"
              label={STRINGS.electricity}
              value={details.electricity}
            />
          )}

          {details.expenses && (
            <DetailItemComponent
              icon={<AttachMoney />}
              iconColorPreset="green"
              label={STRINGS.expenses}
              value={details.expenses}
            />
          )}

          {details.houseCondition && (
            <DetailItemComponent
              icon={<Home />}
              iconColorPreset="blue"
              label={STRINGS.home_condition}
              value={
                <Stack gap={0.5}>
                  <Typography variant="subtitle2">
                    {getStringsLabel({ key: 'house_condition', val: details.houseCondition })}
                  </Typography>
                  {details.houseConditionNote && (
                    <Typography variant="body2" color="text.secondary">
                      {STRINGS.note}: {details.houseConditionNote}
                    </Typography>
                  )}
                </Stack>
              }
            />
          )}

          {details.pros && (
            <DetailItemComponent icon={<ThumbUp />} iconColorPreset="green" label={STRINGS.pons} value={details.pros} />
          )}

          {details.cons && (
            <DetailItemComponent icon={<ThumbDown />} iconColorPreset="red" label={STRINGS.cons} value={details.cons} />
          )}

          {details.other && (
            <DetailItemComponent
              icon={<Info />}
              iconColorPreset="blue"
              label={STRINGS.other_details}
              value={details.other}
            />
          )}

          {openEditDetails && (
            <Button fullWidth startIcon={<ListAltIcon />} onClick={openEditDetails} variant="outlined" sx={{ mt: 2 }}>
              {STRINGS.edit} {STRINGS.disclosures_details}
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default DisclosureDetailsSection;
