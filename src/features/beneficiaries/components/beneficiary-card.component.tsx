import { Button, Stack, useTheme } from '@mui/material';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { LocationPin, Phone, Pin, PriorityHighOutlined, Visibility } from '@mui/icons-material';
import { formatDateTime, sanitizePhoneForTel } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import type { TBenefieciary } from '../types/beneficiary.types';
import { teal } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { useCallback } from 'react';

const BeneficiaryCard = ({
  beneficiary,
  onEnterClick,
}: {
  beneficiary: TBenefieciary;
  onEnterClick?: (id: string) => void;
}) => {
  const theme = useTheme();
  const headerContent = (
    <CardAvatar
      name={beneficiary.name}
      // actions={[
      //   {
      //     icon: <ArrowBackIosOutlined />,
      //     onClick: () => onEnterClick?.(beneficiary.id),
      //   },
      // ]}
    />
  );
  const getPhoneValues = useCallback(() => {
    if (!beneficiary?.phones?.length) {
      return STRINGS.none;
    }
    return beneficiary.phones.map((p, i) => {
      const tel = sanitizePhoneForTel(p.phone || '');
      return (
        <span key={i}>
          <a href={`tel:${tel}`} style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>
            {p.phone}
          </a>
          {i < beneficiary.phones.length - 1 && ' , '}
        </span>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beneficiary.phones]);

  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent
        icon={<Pin />}
        label={STRINGS.national_number}
        iconColorPreset="green"
        value={beneficiary.nationalNumber ?? STRINGS.none}
      />

      <DetailItemComponent icon={<Phone />} label={STRINGS.phones} value={getPhoneValues()} />

      <DetailItemComponent
        icon={<LocationPin />}
        label={STRINGS.patient_address}
        iconColorPreset="deepPurple"
        value={`${beneficiary.area?.name} - ${beneficiary.address ?? ''}`}
      />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.created_at}
        iconColorPreset="blue"
        value={formatDateTime(beneficiary.createdAt)}
      />
    </Stack>
  );

  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${teal[800]}, ${teal[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={
        onEnterClick ? (
          <Button
            onClick={() => onEnterClick(beneficiary.id)}
            variant="outlined"
            startIcon={<Visibility />}
            sx={{ ml: 'auto' }}
          >
            {STRINGS.view}
          </Button>
        ) : null
      }
    />
  );
};

export default BeneficiaryCard;
