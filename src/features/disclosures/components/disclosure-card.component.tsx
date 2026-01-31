import { Button, Chip, Stack } from '@mui/material';
import type { TDisclosure } from '../types/disclosure.types';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { InfoOutline, Person, PriorityHighOutlined, Visibility } from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import { purple } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { Link } from 'react-router-dom';
import CustomBadge from './custom-badge.component';
import FormattedVisitRatingResult from './formatted-visit-rating-result';
import { getDisclosureLateDaysCount } from '../helpers/disclosure.helpers';
import { useMemo } from 'react';

const DisclosureCard = ({ disclosure }: { disclosure: TDisclosure }) => {
  const { isLate, lateDaysCount } = useMemo(() => getDisclosureLateDaysCount(disclosure), [disclosure]);

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

      <FormattedVisitRatingResult disclosure={disclosure} />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.disclosure_created_at}
        value={formatDateTime(disclosure.createdAt)}
      />
    </Stack>
  );
  const isAppointmentCompletedChip = disclosure.isAppointmentCompleted && STRINGS.appointment_completed;

  const isReceivedChip = disclosure.isReceived && STRINGS.is_received;
  const isArchived = disclosure.status === 'archived';

  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${purple[800]}, ${purple[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={0.5}>
            {isAppointmentCompletedChip && (
              <Chip size="small" variant="outlined" label={isAppointmentCompletedChip} color="primary" />
            )}
            {isReceivedChip && <Chip size="small" variant="outlined" label={isReceivedChip} color="secondary" />}
            {isLate && (
              <Chip
                size="small"
                color="error"
                label={`${STRINGS.disclosure_is_late} ( ${lateDaysCount} ${STRINGS.day} )`}
                sx={{
                  zIndex: 1,
                }}
              />
            )}
            {isArchived && <Chip size="small" variant="outlined" label={STRINGS.archived} color="warning" />}
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
