import { Button, Stack, Typography } from '@mui/material';
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import STRINGS from '@/core/constants/strings.constant';
import { Comment, Edit } from '@mui/icons-material';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
// import { blueGrey, indigo } from "@mui/material/colors";
import { Link, useLocation } from 'react-router-dom';
import type { TRating } from '@/features/ratings/types/rating.types';

const RatingCard = ({
  rating,
  customRating,
  isCustom,
}: {
  rating: TRating;
  customRating: string;
  isCustom: boolean;
}) => {
  const { pathname } = useLocation();
  const disclosureId = pathname.split('/').pop() || '';
  return (
    <ReusableCardComponent
      // headerBackground={
      //   isCustom
      //     ? `linear-gradient(to right, ${blueGrey[800]}, ${blueGrey[500]})`
      //     : `linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`
      // }
      headerContent={
        isCustom ? (
          <Typography color="white">{STRINGS.custom_rating}</Typography>
        ) : (
          <Typography color="white">
            {rating?.name} - ( {rating?.code} )
          </Typography>
        )
      }
      bodyContent={
        <Stack gap={2}>
          {customRating && <Typography>{customRating}</Typography>}
          {/*   <DetailItem
            label={STRINGS.rating}
            icon={<RateReview />}
            value={`${rating.rating?.name} - ( ${rating.rating?.code} )`}
          /> */}

          {/* <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={`${formatDateTime(rating.createdAt)} ${STRINGS.by} ${rating.createdBy?.name}`}
          /> */}

          {/* <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              rating.updatedAt === rating.createdAt
                ? STRINGS.none
                : `${formatDateTime(rating.updatedAt)} ${STRINGS.by} ${rating.updatedBy?.name}`
            }
          /> */}
          <DetailItem icon={<Comment />} label={STRINGS.note} value={rating?.name || STRINGS.none} />
        </Stack>
      }
      footerContent={
        <Link style={{ alignSelf: 'end' }} to={`/disclosures/${disclosureId}/rating/action`}>
          <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
        </Link>
      }
    />
  );
};

// const DisclosureRatings = ({ disclosureId }: { disclosureId?: string }) => {
const DisclosureRatings = ({
  rating,
  customRating,
  isCustom,
}: {
  rating: TRating;
  customRating: string;
  isCustom: boolean;
}) => {
  // const { data: { items: ratings } = { items: [] }, isFetching } =
  //   disclosuresApi.useGetDisclosureRatingsQuery(
  //     { disclosureId: disclosureId! },
  //     { skip: !disclosureId },
  //   );

  return (
    <Stack gap={2} sx={{ position: 'relative' }}>
      {/* {ratings.map((r) => ( */}
      rate
      <RatingCard rating={rating} customRating={customRating} isCustom={isCustom} />
      {/* ))} */}
      {/* {!isFetching && !ratings.length && <Nodata />} */}
      {/* {isFetching && <LoadingOverlay />} */}
    </Stack>
  );
};

export default DisclosureRatings;
