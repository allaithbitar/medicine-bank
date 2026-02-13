import { Stack } from '@mui/material';
import type { TPaymentHistoryItem } from '../types/payment.types';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { Person, Star, AccessTime, Payment } from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { memo } from 'react';

interface IHistoryPaymentCardProps {
  item: TPaymentHistoryItem;
}

const HistoryPaymentCard = ({ item }: IHistoryPaymentCardProps) => {
  const ratingValue = item.rating.isCustomRating ? item.rating.customRating : item.rating.name || STRINGS.none;
  const headerContent = <CardAvatar name={item.patient.name} subLabel={item.scout.name} icon={<Person />} />;
  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent icon={<Star />} label={STRINGS.rating} value={ratingValue} iconColorPreset="blue" />
      <DetailItemComponent
        icon={<AccessTime />}
        label={STRINGS.completed_at}
        value={formatDateTime(item.rating.completedAt)}
        iconColorPreset="green"
      />
      <DetailItemComponent
        icon={<Payment />}
        label={STRINGS.paid_at}
        value={formatDateTime(item.paidAt)}
        iconColorPreset="deepPurple"
      />
    </Stack>
  );
  return <ReusableCardComponent headerContent={headerContent} bodyContent={bodyContent} />;
};

export default memo(HistoryPaymentCard);
