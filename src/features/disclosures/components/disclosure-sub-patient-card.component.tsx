import { Box, Avatar, Stack, Tooltip, Typography } from '@mui/material';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import PhoneActionsMenu from '@/core/components/common/phone-actions-menu/phone-actions-menu.component';
import STRINGS from '@/core/constants/strings.constant';
import { Edit, Person, Phone, Pin, Cake, Work, Info } from '@mui/icons-material';
import type { TDisclosureSubPatient } from '../types/disclosure.types';
import { formatDateTime } from '@/core/helpers/helpers';
import { useCallback } from 'react';

interface DisclosureSubPatientCardProps {
  subPatient: TDisclosureSubPatient;
  onEdit?: (sp: TDisclosureSubPatient) => void;
}

const DisclosureSubPatientCard = ({ subPatient, onEdit }: DisclosureSubPatientCardProps) => {
  const getPhoneValues = useCallback(() => {
    if (!subPatient?.phones?.length) {
      return STRINGS.none;
    }
    return (
      <Stack spacing={0.5}>
        {subPatient.phones.map((phone, index) => (
          <PhoneActionsMenu key={index} phone={phone} />
        ))}
      </Stack>
    );
  }, [subPatient.phones]);

  const headerContent = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <Person sx={{ color: 'white' }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="div"
            color="white"
            fontWeight="semibold"
            noWrap
            sx={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {subPatient.name}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.85)" noWrap>
            {subPatient.gender ? STRINGS[subPatient.gender as 'male' | 'female'] : STRINGS.none}
          </Typography>
        </Box>
      </Box>

      {onEdit && (
        <Stack direction="row" gap={1} sx={{ color: 'white', flexShrink: 0, ml: 2 }}>
          <Tooltip title={STRINGS.edit} arrow>
            <CustomIconButton onClick={() => onEdit(subPatient)} size="small">
              <Edit sx={{ color: 'white' }} />
            </CustomIconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            icon={<Pin />}
            label={STRINGS.national_number}
            value={subPatient.nationalNumber || STRINGS.none}
          />

          <DetailItemComponent
            label={STRINGS.birth_date}
            icon={<Cake />}
            value={
              subPatient.birthDate
                ? formatDateTime(subPatient.birthDate, false, { year: 'numeric', month: 'long', day: 'numeric' })
                : STRINGS.none
            }
          />

          <DetailItemComponent label={STRINGS.phone_numbers} icon={<Phone />} value={getPhoneValues()} />

          <DetailItemComponent label={STRINGS.job_or_school} icon={<Work />} value={subPatient.job || STRINGS.none} />

          <DetailItemComponent label={STRINGS.patient_about} icon={<Info />} value={subPatient.about || STRINGS.none} copyText={subPatient.about} />
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default DisclosureSubPatientCard;
