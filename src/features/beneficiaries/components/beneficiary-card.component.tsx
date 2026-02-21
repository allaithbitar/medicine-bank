import { Button, Stack } from '@mui/material';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { LocationPin, Phone, Pin, PriorityHighOutlined, Visibility } from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import type { TBenefieciary } from '../types/beneficiary.types';
import { teal } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { useCallback } from 'react';
import PhoneActionsMenu from '@/core/components/common/phone-actions-menu/phone-actions-menu.component';

const BeneficiaryCard = ({
  beneficiary,
  onEnterClick,
}: {
  beneficiary: TBenefieciary;
  onEnterClick?: (id: string) => void;
}) => {
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
    return (
      <Stack spacing={0.5}>
        {beneficiary.phones.map((p) => (
          <PhoneActionsMenu key={p.id} phone={p.phone} />
        ))}
      </Stack>
    );
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
        value={
          beneficiary.address
            ? `${beneficiary.area?.name ?? ''}  - ${beneficiary.address || ''}`
            : (beneficiary.area?.name ?? '')
        }
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
