import { Card, Stack } from '@mui/material';
import disclosuresApi from '../api/disclosures.api';
import { ConsultingAdviserCard } from '../components/consulting-adviser-card.component';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import ratingsApi from '@/features/ratings/api/ratings.api';
import Header from '@/core/components/common/header/header';
import Nodata from '@/core/components/common/no-data/no-data.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { useCallback } from 'react';

function AdviserDisclosureConsultationsPage() {
  const { closeModal, openModal } = useModal();
  const { data: response = { items: [] }, isFetching } = disclosuresApi.useGetDisclosureAdviserConsultationsQuery({
    consultationStatus: 'pending',
  });
  const adviserConsultations = response.items ?? [];

  const { data: ratings = [], isFetching: isFetchingRatings } = ratingsApi.useGetRatingsQuery({});

  const [completeConsultation, { isLoading: isCompleting }] = disclosuresApi.useCompleteConsultationMutation();

  const handleSelectRating = useCallback(
    async ({ ratingId, adviserConsultationId }: { adviserConsultationId: string; ratingId: string }) => {
      try {
        await completeConsultation({ id: adviserConsultationId, ratingId }).unwrap();
        notifySuccess(STRINGS.edited_successfully);
        closeModal();
      } catch (err: any) {
        notifyError(err);
      }
    },
    [closeModal, completeConsultation]
  );

  const handleChipClicked = useCallback(
    ({
      adviserConsultationId,
      ratingId,
      ratingName,
    }: {
      ratingId: string;
      adviserConsultationId: string;
      ratingName: string;
    }) => {
      openModal({
        name: 'CONFIRM_MODAL',
        props: {
          message: `${STRINGS.rate_patient} (${ratingName})`,
          onConfirm: () => handleSelectRating({ ratingId, adviserConsultationId }),
        },
      });
    },
    [handleSelectRating, openModal]
  );

  return (
    <Card>
      <Stack gap={2} sx={{ position: 'relative' }}>
        <Header title={STRINGS.consulting_adviser} />
        {adviserConsultations.map((ac) => (
          <ConsultingAdviserCard
            key={ac.id}
            adviserConsultation={ac}
            ratings={ratings}
            handleSelectRating={(ratingId, adviserConsultationId, ratingName) =>
              handleChipClicked({ ratingId, adviserConsultationId, ratingName })
            }
          />
        ))}
        {!isFetching && !adviserConsultations.length && <Nodata />}
        {isFetching && isFetchingRatings && isCompleting && <LoadingOverlay />}
      </Stack>
    </Card>
  );
}

export default AdviserDisclosureConsultationsPage;
