import { baseUrl } from '@/core/api/root.api';
import { getStringsLabel, getVoiceSrc } from '@/core/helpers/helpers';
import { Typography, Stack, Chip, Divider } from '@mui/material';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import STRINGS from '@/core/constants/strings.constant';
// import { purple } from '@mui/material/colors';
import type { TDisclosureAdviserConsultation } from '../types/disclosure.types';
import type { TRating } from '@/features/ratings/types/rating.types';
import type { ReactNode } from 'react';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

export const ConsultingAdviserCard = ({
  adviserConsultation,
  ratings,
  handleSelectRating,
  footerContent,
}: {
  adviserConsultation: TDisclosureAdviserConsultation;
  handleSelectRating?: (ratingId: string, adviserConsultationId: string, ratingName: string) => void;
  ratings?: TRating[];
  footerContent?: ReactNode;
}) => {
  return (
    <ReusableCardComponent
      cardSx={{ minHeight: 200 }}
      // headerBackground={`linear-gradient(to right, ${purple[800]}, ${purple[500]})`}
      headerContent={
        <CardAvatar
          name={`${STRINGS.consulting} - ${adviserConsultation.createdBy?.name}`}
          icon={<PsychologyAltIcon fontSize="large" />}
        />
      }
      bodyContent={
        <Stack gap={2} alignItems="center">
          {adviserConsultation.consultationNote && (
            <>
              <Typography alignSelf="start">{adviserConsultation.consultationNote}</Typography>
              <Divider flexItem />
            </>
          )}
          <Stack sx={{ flexDirection: 'row', gap: 1, width: '100%' }}>
            <Typography>{STRINGS.status} :</Typography>
            <Chip
              size="small"
              color={adviserConsultation.consultationStatus === 'pending' ? 'warning' : 'success'}
              label={getStringsLabel({
                key: 'consulting_adviser',
                val: adviserConsultation.consultationStatus,
              })}
            />
          </Stack>
          {(adviserConsultation.disclosureRating?.rating?.code || ratings || adviserConsultation.consultationAudio) && (
            <Divider flexItem />
          )}
          {adviserConsultation.disclosureRating?.rating?.code && (
            <Typography alignSelf="start">{adviserConsultation.disclosureRating?.rating?.code}</Typography>
          )}
          {adviserConsultation.consultationAudio && (
            <>
              <audio
                controlsList="nodownload"
                controls
                src={getVoiceSrc({ baseUrl, filePath: adviserConsultation.consultationAudio })}
              />
              {ratings && <Divider flexItem />}
            </>
          )}

          {ratings && (
            <>
              <Typography alignSelf="start">{STRINGS.select_rating_quickly}</Typography>
              <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
                {ratings?.map((r) => (
                  <Chip
                    key={r.id}
                    label={r.name}
                    color="primary"
                    onClick={() => handleSelectRating?.(r.id, adviserConsultation.id, r.name)}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>
      }
      footerContent={footerContent}
    />
  );
};
