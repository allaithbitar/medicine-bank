import { Stack } from '@mui/material';
import type { TRating } from '../types/rating.types';
import STRINGS from '@/core/constants/strings.constant';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import RatingsList from '../components/ratings-list.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRatingsLoader } from '../hooks/ratings-loader.hook';

const RatingsPage = () => {
  const navigate = useNavigate();

  const { data: ratings = [], isLoading: isLoadingRatings } = useRatingsLoader();

  const handleOpenRatingActionPage = (oldRating?: TRating) => {
    if (oldRating) {
      navigate(`/ratings/action?id=${oldRating.id}`);
    } else {
      navigate('/ratings/action');
    }
  };

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <CustomAppBar title={STRINGS.ratings_management} subtitle={STRINGS.add_manage_ratings} />
      <RatingsList onEditRating={handleOpenRatingActionPage} isLoadingRatings={isLoadingRatings} ratings={ratings} />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenRatingActionPage(),
          },
        ]}
      />
    </Stack>
  );
};

export default RatingsPage;
