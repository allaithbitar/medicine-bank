import { Button, Stack } from '@mui/material';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { LocationPin, Phone, Pin, PriorityHighOutlined, Visibility } from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import type { TBenefieciary } from '../types/beneficiary.types';
import { teal } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

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

  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent
        icon={<Pin />}
        label={STRINGS.national_number}
        iconColorPreset="green"
        value={beneficiary.nationalNumber ?? STRINGS.none}
      />

      <DetailItemComponent
        icon={<Phone />}
        label={STRINGS.phones}
        value={beneficiary?.phones?.map((p) => p.phone).join(', ')}
      />

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
