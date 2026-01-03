import { baseUrl } from '@/core/api/root.api';
import { formatDateTime, getStringsLabel } from '@/core/helpers/helpers';
import { EventAvailable, Person, ThumbsUpDown } from '@mui/icons-material';
import { Typography, Stack } from '@mui/material';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Comment } from '@mui/icons-material';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import STRINGS from '@/core/constants/strings.constant';
import { purple } from '@mui/material/colors';
import type { TDisclosureAdviserConsultation } from '../types/disclosure.types';
import type { ReactNode } from 'react';

export const ConsultingAdviserCard = ({
  adviserConsultation,
  footerContent,
}: {
  adviserConsultation: TDisclosureAdviserConsultation;
  footerContent?: ReactNode;
}) => {
  const VoiceSrc = `${baseUrl}/public/audio/${adviserConsultation.consultationAudio}`;

  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${purple[800]}, ${purple[500]})`}
      headerContent={<Typography color="white">{STRINGS.note}</Typography>}
      bodyContent={
        <Stack gap={2}>
          <DetailItem icon={<Comment />} label={STRINGS.details} value={adviserConsultation.consultationNote} />
          <DetailItem
            icon={<Person />}
            label={STRINGS.created_By}
            value={(adviserConsultation.createdBy as any)?.name ?? adviserConsultation.createdBy}
          />
          <DetailItem
            icon={<PublishedWithChangesIcon />}
            label={STRINGS.status}
            value={getStringsLabel({
              key: 'consulting_adviser',
              val: adviserConsultation.consultationStatus,
            })}
          />
          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={formatDateTime(adviserConsultation.createdAt)}
          />
          {adviserConsultation.disclosureRating?.rating?.code && (
            <DetailItem
              icon={<ThumbsUpDown />}
              label={STRINGS.rating}
              value={adviserConsultation.disclosureRating?.rating?.code}
            />
          )}

          {adviserConsultation.consultationAudio ? (
            <DetailItem
              icon={<VolumeDownIcon />}
              label={''}
              value={
                <Stack direction="row" alignItems="center">
                  <audio controlsList="nodownload" controls src={VoiceSrc}>
                    Your browser does not support the audio element.
                  </audio>
                </Stack>
              }
            />
          ) : null}
        </Stack>
      }
      footerContent={footerContent}
    />
  );
};
