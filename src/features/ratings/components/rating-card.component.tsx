import STRINGS from '@/core/constants/strings.constant';
import { Stack } from '@mui/material';
import { red, orange } from '@mui/material/colors';
import type { TRating } from '../types/rating.types';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import { memo } from 'react';
import { Edit, RateReview } from '@mui/icons-material';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

const RatingCard = ({ rating, onEdit }: { rating: TRating; onEdit: (r: TRating) => void }) => {
  const headerContent = (
    <CardAvatar
      name={rating.name}
      icon={<RateReview />}
      actions={[{ icon: <Edit />, onClick: () => onEdit(rating) }]}
    />
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${red[400]}, ${orange[400]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent label={STRINGS.code} icon={<CodeIcon />} value={rating.code} />
          <DetailItemComponent label={STRINGS.description} icon={<AssignmentIcon />} value={rating.description} />
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default memo(RatingCard);
