import { Button, Chip, Stack } from '@mui/material';
import type { TDisclosure } from '../types/disclosure.types';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { HelpOutlined, InfoOutline, Person, PriorityHighOutlined, Visibility } from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import { purple } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import CustomBadge from './custom-badge.component';

const FormattedVisitResult = ({ disclosure }: { disclosure: TDisclosure }) => {
  const colors = useMemo(() => {
    switch (disclosure.visitResult) {
      case 'not_completed': {
        return 'warning';
      }
      case 'cant_be_completed': {
        return 'error';
      }
      case 'completed': {
        return 'success';
      }
      default: {
        return 'grey';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclosure.visitResult]);

  return (
    <CustomBadge colors={colors}>
      {disclosure.visitResult ? STRINGS[disclosure.visitResult] : STRINGS.hasnt_been_visited_yet}
    </CustomBadge>
  );
};

const FormattedRatingResult = ({ disclosure }: { disclosure: TDisclosure }) => {
  const colors = useMemo(() => {
    if (!disclosure.ratingId && !disclosure.isCustomRating && !disclosure.customRating) {
      return 'grey';
    }
    return 'info';
  }, [disclosure.visitResult]);

  return (
    <CustomBadge colors={colors}>
      {disclosure.rating?.name || (disclosure.isCustomRating && STRINGS.custom_rating) || STRINGS.hasnt_been_rated_yet}
    </CustomBadge>
  );
};

const DisclosureCard = ({ disclosure }: { disclosure: TDisclosure }) => {
  const headerContent = (
    <CardAvatar
      name={disclosure.patient.name}
      extras={
        <Chip
          label={disclosure.priority.name}
          sx={{
            bgcolor: (theme) => disclosure.priority.color || theme.palette.grey[800],
            color: (theme) => theme.palette.info.contrastText,
            zIndex: 1,
          }}
        />
      }
    />
  );

  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent
        icon={<InfoOutline />}
        label={STRINGS.status}
        value={
          <CustomBadge
            colors={
              disclosure.status === 'active' ? 'success' : disclosure.status === 'suspended' ? 'error' : 'secondary'
            }
          >
            {STRINGS[disclosure.status]}
          </CustomBadge>
        }
      />

      <DetailItemComponent
        icon={<Person />}
        label={STRINGS.disclosure_scout}
        value={disclosure.scout?.name ?? STRINGS.none}
      />

      <DetailItemComponent
        icon={<HelpOutlined />}
        label={`${STRINGS.last_visit_result} `}
        value={<FormattedVisitResult disclosure={disclosure} />}
      />
      <DetailItemComponent
        icon={<HelpOutlined />}
        label={`${STRINGS.last_rating_result} `}
        value={<FormattedRatingResult disclosure={disclosure} />}
      />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.disclosure_created_at}
        value={formatDateTime(disclosure.createdAt)}
      />
    </Stack>
  );
  const isAppointmentCompletedChip = disclosure.isAppointmentCompleted && STRINGS.appointment_completed;

  const isReceivedChip = disclosure.isReceived && STRINGS.is_received;
  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${purple[800]}, ${purple[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={0.5}>
            {isAppointmentCompletedChip && (
              <Chip variant="outlined" label={isAppointmentCompletedChip} color="primary" />
            )}
            {isReceivedChip && <Chip variant="outlined" label={isReceivedChip} color="secondary" />}
          </Stack>

          <Link to={`/disclosures/${disclosure.id}`}>
            <Button variant="outlined" startIcon={<Visibility />}>
              {STRINGS.view}
            </Button>
          </Link>
        </Stack>
      }
    />
  );
};

export default DisclosureCard;
