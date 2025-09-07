import { Stack } from "@mui/material";
import ratingsApi from "../api/ratings.api";
import type { TRating } from "../types/rating.types";
import STRINGS from "@/core/constants/strings.constant";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";
import RatingsList from "../components/ratings-list.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { Add } from "@mui/icons-material";
import { useModal } from "@/core/components/common/modal/modal-provider.component";

const RatingsPage = () => {
  const { openModal } = useModal();

  const { data: ratings = [], isLoading: isLoadingRatings } =
    ratingsApi.useGetRatingsQuery({});

  const handleOpenRatingModal = (oldRating?: TRating) => {
    openModal({
      name: "RATING_FORM_MODAL",
      props: {
        oldRating,
      },
    });
  };

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      <CustomAppBar
        title={STRINGS.ratings_management}
        subtitle={STRINGS.add_manage_ratings}
      />
      <RatingsList
        onEditRating={handleOpenRatingModal}
        isLoadingRatings={isLoadingRatings}
        ratings={ratings}
      />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenRatingModal(),
          },
        ]}
      />
    </Stack>
  );
};

export default RatingsPage;
