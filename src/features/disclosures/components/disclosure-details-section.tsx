import { Stack, Typography, Button, Card, Divider, Box } from '@mui/material';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
// import { Home, Work, ElectricBolt, AttachMoney, MedicalServices, Info } from '@mui/icons-material';
import { ThumbUp, ThumbDown, Note, Medication, AudioFile } from '@mui/icons-material';
// import { getStringsLabel } from '@/core/helpers/helpers';
import { getVoiceSrc } from '@/core/helpers/helpers';
import { useDisclosureDetailsLoader } from '../hooks/disclosure-details-loader.hook';
import type { TDisclosure } from '../types/disclosure.types';
import { baseUrl } from '@/core/api/root.api';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { useEffect, useState } from 'react';
import { readAudioFile } from '@/core/helpers/opfs-audio.helpers';

const DisclosureDetailsSection = ({
  disclosureId,
  openEditDetails,
  disclosure,
}: {
  disclosureId?: string;
  openEditDetails?: () => void;
  disclosure?: TDisclosure;
}) => {
  const { data: details, isFetching } = useDisclosureDetailsLoader(disclosureId!);
  const isArchived = disclosure?.status === 'archived';
  const navigate = useNavigate();
  const isOffline = useIsOffline();
  const [offlineAudioObjectUrl, setOfflineAudioObjectUrl] = useState('');

  useEffect(() => {
    if (isOffline && details?.audio) {
      readAudioFile(details.audio).then((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setOfflineAudioObjectUrl(url);
        }
      });
    }
    return () => {
      if (offlineAudioObjectUrl) {
        URL.revokeObjectURL(offlineAudioObjectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline, details?.audio]);

  const handleOpenDisclosureDetails = () => {
    navigate(`/disclosures/details/action?disclosureId=${disclosureId}`);
  };

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
              <Button disabled={isArchived} onClick={handleOpenDisclosureDetails}>
                {STRINGS.add}
              </Button>
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
          {/* {details.diseasesOrSurgeries && (
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
              value={details.jobOrSchool ?? STRINGS.none}
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
          )} */}

          {details.note && (
            <DetailItemComponent icon={<Note />} iconColorPreset="blue" label={STRINGS.note} value={details.note} />
          )}

          {details.pros && (
            <DetailItemComponent icon={<ThumbUp />} iconColorPreset="green" label={STRINGS.pons} value={details.pros} />
          )}

          {details.cons && (
            <DetailItemComponent icon={<ThumbDown />} iconColorPreset="red" label={STRINGS.cons} value={details.cons} />
          )}

          {details.meds && (
            <DetailItemComponent
              icon={<Medication />}
              iconColorPreset="deepPurple"
              label={STRINGS.medicines}
              value={details.meds}
            />
          )}

          {details.audio && (
            <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
              <Stack gap={1}>
                <Stack direction="row" gap={1} alignItems="center">
                  <AudioFile sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight="medium">
                    {STRINGS.recorded_audio}
                  </Typography>
                </Stack>
                <Divider />
                {isOffline && offlineAudioObjectUrl && (
                  <audio controls src={offlineAudioObjectUrl} style={{ width: '100%' }} />
                )}

                {!isOffline && details.audio && (
                  <audio controls src={getVoiceSrc({ baseUrl, filePath: details.audio })} style={{ width: '100%' }} />
                )}
                {isOffline && !offlineAudioObjectUrl && (
                  <Typography color="warning.main" variant="body2">
                    {STRINGS.cant_play_synced_notes}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* {details.other && (
            <DetailItemComponent
              icon={<Info />}
              iconColorPreset="blue"
              label={STRINGS.other_details}
              value={details.other}
            />
          )} */}

          {openEditDetails && (
            <Button
              fullWidth
              disabled={isArchived}
              startIcon={<ListAltIcon />}
              onClick={openEditDetails}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              {STRINGS.edit} {STRINGS.disclosures_details}
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default DisclosureDetailsSection;
