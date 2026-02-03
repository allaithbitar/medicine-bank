import { Card, Stack, Tabs, Tab, Button } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import disclosuresApi from '../api/disclosures.api';
import { ConsultingAdviserCard } from '../components/consulting-adviser-card.component';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import ratingsApi from '@/features/ratings/api/ratings.api';
import Header from '@/core/components/common/header/header';
import Nodata from '@/core/components/common/no-data/no-data.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { usePermissions } from '@/core/hooks/use-permissions.hook';

function AdviserDisclosureConsultationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') === 'pending' ? 'pending' : 'completed';
  const navigate = useNavigate();
  const { closeModal, openModal } = useModal();
  const { currentCanRate } = usePermissions();

  const { data: response = { items: [] }, isFetching } = disclosuresApi.useGetDisclosureAdviserConsultationsQuery({
    consultationStatus: currentTab,
  });
  const adviserConsultations = response.items ?? [];

  const { data: ratings = [], isFetching: isFetchingRatings } = ratingsApi.useGetRatingsQuery(
    {},
    { skip: currentTab === 'completed' }
  );

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
        <Header title={STRINGS.disclosure_consulting} />
        <Tabs
          value={currentTab}
          variant="fullWidth"
          onChange={(_, v) =>
            setSearchParams((prev) => ({ ...prev, tab: v }), {
              replace: true,
            })
          }
          slotProps={{
            indicator: {
              sx: {
                height: '5%',
                borderRadius: 10,
              },
            },
          }}
        >
          <Tab value="pending" label={STRINGS.consulting_adviser_pending} />
          <Tab value="completed" label={STRINGS.consulting_adviser_completed} />
        </Tabs>

        {adviserConsultations.map((ac) => (
          <ConsultingAdviserCard
            key={ac.id}
            adviserConsultation={ac}
            ratings={currentTab === 'pending' && currentCanRate ? ratings : undefined}
            handleSelectRating={
              currentTab === 'pending' && currentCanRate
                ? (ratingId, adviserConsultationId, ratingName) =>
                    handleChipClicked({ ratingId, adviserConsultationId, ratingName })
                : undefined
            }
            footerContent={
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/consulting-adviser/${ac.id}`)}
                fullWidth
              >
                {STRINGS.view_details}
              </Button>
            }
          />
        ))}

        {!isFetching && !adviserConsultations.length && <Nodata />}
        {(isFetching || isFetchingRatings || isCompleting) && <LoadingOverlay />}
      </Stack>
    </Card>
  );
}

export default AdviserDisclosureConsultationsPage;
