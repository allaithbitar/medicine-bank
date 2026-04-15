import { Button, Chip, Stack } from '@mui/material';
import type { TDisclosure } from '../types/disclosure.types';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import {
  InfoOutline,
  LocationPin,
  Person,
  PriorityHighOutlined,
  Visibility,
  Archive,
  Phone,
} from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
// import { purple } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { useNavigate } from 'react-router-dom';
import CustomBadge from './custom-badge.component';
import FormattedVisitRatingResult from './formatted-visit-rating-result';
import { getDisclosureLateDaysCount } from '../helpers/disclosure.helpers';
import { useMemo, useCallback } from 'react';
import PhoneActionsMenu from '@/core/components/common/phone-actions-menu/phone-actions-menu.component';

const DisclosureCard = ({ disclosure }: { disclosure: TDisclosure }) => {
  const navigate = useNavigate();
  const { isLate, lateDaysCount } = useMemo(() => {
    return getDisclosureLateDaysCount(disclosure);
  }, [disclosure]);

  const handleCardClick = useCallback(() => {
    navigate(`/disclosures/${disclosure.id}`);
  }, [navigate, disclosure.id]);

  const handleViewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/disclosures/${disclosure.id}`);
    },
    [navigate, disclosure.id]
  );

  const getPhoneValues = useCallback(() => {
    if (!disclosure.patient.phones?.length) {
      return STRINGS.none;
    }
    return (
      <Stack spacing={0.5}>
        {disclosure.patient.phones.map((p) => (
          <PhoneActionsMenu key={p.id} phone={p.phone} />
        ))}
      </Stack>
    );
  }, [disclosure.patient.phones]);

  const headerContent = (
    <CardAvatar
      name={disclosure.patient.name}
      extras={
        <Stack direction="row" gap={1}>
          {!!disclosure.type && (
            <Chip
              label={STRINGS[disclosure.type]}
              sx={{
                bgcolor: (theme) => theme.palette.secondary.main,
                color: (theme) => theme.palette.info.contrastText,
                zIndex: 1,
              }}
            />
          )}
          <Chip
            label={disclosure.priority.name}
            sx={{
              bgcolor: (theme) => disclosure.priority.color || theme.palette.grey[800],
              color: (theme) => theme.palette.info.contrastText,
              zIndex: 1,
            }}
          />
        </Stack>
      }
    />
  );
  const showAddress = () => {
    if (disclosure.patient.address && !disclosure.patient.area?.name) {
      return disclosure.patient.address;
    }
    if (disclosure.patient.area?.name && !disclosure.patient.address) {
      return disclosure.patient.area.name;
    }
    if (disclosure.patient.area?.name && disclosure.patient.address) {
      return `${disclosure.patient.area.name}  - ${disclosure.patient.address}`;
    }
    return STRINGS.none;
  };

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

      <DetailItemComponent icon={<Phone />} label={STRINGS.phone_numbers} value={getPhoneValues()} />

      <DetailItemComponent
        icon={<LocationPin />}
        label={STRINGS.patient_address}
        value={showAddress()}
        copyText={showAddress() !== STRINGS.none ? showAddress() : undefined}
      />

      {disclosure.archiveNumber && (
        <DetailItemComponent icon={<Archive />} label={STRINGS.archive_number} value={disclosure.archiveNumber} />
      )}

      <FormattedVisitRatingResult disclosure={disclosure} />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.disclosure_created_at}
        value={formatDateTime(disclosure.createdAt)}
      />
    </Stack>
  );
  const isAppointmentCompletedChip = disclosure.isAppointmentCompleted && STRINGS.appointment_completed;

  // const isReceivedChip = disclosure.isReceived && STRINGS.is_received;

  return (
    <ReusableCardComponent
      // headerBackground={`linear-gradient(to right, ${purple[800]}, ${purple[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      onClick={handleCardClick}
      footerContent={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={0.5}>
            {/* {isReceivedChip && <Chip size="small" variant="outlined" label={isReceivedChip} color="secondary" />} */}
            {isAppointmentCompletedChip && (
              <Chip size="small" variant="outlined" label={isAppointmentCompletedChip} color="primary" />
            )}
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
          </Stack>

          <Button variant="outlined" startIcon={<Visibility />} onClick={handleViewClick}>
            {STRINGS.view}
          </Button>
        </Stack>
      }
    />
  );
};

export default DisclosureCard;
