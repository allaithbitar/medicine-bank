import { Button, Stack, Typography } from "@mui/material";
import disclosuresApi from "../api/disclosures.api";
import type { TDisclosureRating } from "../types/disclosure.types";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import { Comment, Edit, EventAvailable, History } from "@mui/icons-material";
import { formatDateTime } from "@/core/helpers/helpers";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import { blueGrey, indigo } from "@mui/material/colors";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import Nodata from "@/core/components/common/no-data/no-data.component";
import { Link } from "react-router-dom";

const RatingCard = ({ rating }: { rating: TDisclosureRating }) => {
  return (
    <ReusableCardComponent
      headerBackground={
        rating.isCustom
          ? `linear-gradient(to right, ${blueGrey[800]}, ${blueGrey[500]})`
          : `linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`
      }
      headerContent={
        rating.isCustom ? (
          <Typography color="white">{STRINGS.custom_rating}</Typography>
        ) : (
          <Typography color="white">
            {rating.rating?.name} - ( {rating.rating?.code} )
          </Typography>
        )
      }
      bodyContent={
        <Stack gap={2}>
          {rating.customRating && (
            <Typography>{rating.customRating}</Typography>
          )}
          {/*   <DetailItem
            label={STRINGS.rating}
            icon={<RateReview />}
            value={`${rating.rating?.name} - ( ${rating.rating?.code} )`}
          /> */}

          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={formatDateTime(rating.createdAt)}
          />

          <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              rating.updatedAt === rating.createdAt
                ? STRINGS.none
                : formatDateTime(rating.updatedAt)
            }
          />
          <DetailItem
            icon={<Comment />}
            label={STRINGS.note}
            value={rating.note || STRINGS.none}
          />
        </Stack>
      }
      footerContent={
        <Link
          style={{ alignSelf: "end" }}
          to={`/disclosures/${rating.disclosureId}/rating/action?ratingId=${rating.id}`}
        >
          <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
        </Link>
      }
    />
  );
};

const DisclosureRatings = ({ disclosureId }: { disclosureId?: string }) => {
  const { data: { items: ratings } = { items: [] }, isFetching } =
    disclosuresApi.useGetDisclosureRatingsQuery(
      { disclosureId: disclosureId! },
      { skip: !disclosureId },
    );

  return (
    <Stack gap={2} sx={{ position: "relative" }}>
      {ratings.map((r) => (
        <RatingCard key={r.id} rating={r} />
      ))}
      {!isFetching && !ratings.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureRatings;
