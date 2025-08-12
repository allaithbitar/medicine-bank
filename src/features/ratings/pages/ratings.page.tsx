import { Grid, Stack, Typography } from "@mui/material";
import ratingsApi from "../api/ratings.api";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import ReusableCard from "@/core/components/common/reusable-card/reusable-card.component";
import type { TRating } from "../types/rating.types";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import { Person } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";

const RatingCard = ({ rating }: { rating: TRating }) => {
  return (
    <ReusableCard
      headerContent={<Typography color="white">{rating.name}</Typography>}
      headerBackground={`linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItem
            label={STRINGS.code}
            icon={<Person />}
            value={rating.code}
          />

          <DetailItem
            label={STRINGS.description}
            icon={<Person />}
            value={rating.description}
          />
        </Stack>
      }
      footerContent={null}
    />
  );
};

const RatingsPage = () => {
  const { data: ratings = [] } = ratingsApi.useGetRatingsQuery({});
  return (
    <Grid container spacing={2}>
      {ratings.map((r) => (
        <Grid size={DEFAULT_GRID_SIZES} key={r.id}>
          <RatingCard key={r.id} rating={r} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RatingsPage;
