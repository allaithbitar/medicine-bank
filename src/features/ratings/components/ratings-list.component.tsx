import Nodata from '@/core/components/common/no-data/no-data.component';
import STRINGS from '@/core/constants/strings.constant';
import type { TRating } from '../types/rating.types';
import RateReviewIcon from '@mui/icons-material/RateReview';
import RatingCard from './rating-card.component';
import { memo } from 'react';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';

const RatingsList = ({
  ratings,
  isLoadingRatings,
  onEditRating,
}: {
  ratings: TRating[];
  isLoadingRatings: boolean;
  onEditRating?: (rating: TRating) => void;
}) => {
  return (
    <>
      {ratings.length === 0 && !isLoadingRatings && (
        <Nodata icon={RateReviewIcon} title={STRINGS.no_ratings_found} subTitle={STRINGS.add_to_see} />
      )}

      <VirtualizedList isLoading={isLoadingRatings} items={ratings}>
        {({ item: r }) => {
          return <RatingCard onEdit={onEditRating} rating={r} />;
        }}
      </VirtualizedList>
    </>
  );
};

export default memo(RatingsList);
