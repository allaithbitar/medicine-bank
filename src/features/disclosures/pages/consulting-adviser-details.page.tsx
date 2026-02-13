import { Card, Stack, Chip, Divider } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import disclosuresApi from '../api/disclosures.api';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import ratingsApi from '@/features/ratings/api/ratings.api';
import Header from '@/core/components/common/header/header';
import Nodata from '@/core/components/common/no-data/no-data.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import { baseUrl } from '@/core/api/root.api';
import { formatDateTime, getStringsLabel, getVoiceSrc } from '@/core/helpers/helpers';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Comment } from '@mui/icons-material';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { EventAvailable, Person, ThumbsUpDown } from '@mui/icons-material';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import { useDisclosureConsultationLoader } from '../hooks/disclosure-consultaion-loader.hook';

function ConsultingAdviserDetailsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { closeModal, openModal } = useModal();
  const { currentCanRate } = usePermissions();

  const { data: consultation, isFetching, error } = useDisclosureConsultationLoader(id);

  const { data: ratings = [], isFetching: isFetchingRatings } = ratingsApi.useGetRatingsQuery(
    {},
    { skip: !consultation || consultation.consultationStatus === 'completed' }
  );

  const [completeConsultation, { isLoading: isCompleting }] = disclosuresApi.useCompleteConsultationMutation();

  const handleSelectRating = useCallback(
    async ({ ratingId, adviserConsultationId }: { adviserConsultationId: string; ratingId: string }) => {
      try {
        await completeConsultation({ id: adviserConsultationId, ratingId }).unwrap();
        notifySuccess(STRINGS.edited_successfully);
        closeModal();
        navigate(-1);
      } catch (err: any) {
        notifyError(err);
      }
    },
    [closeModal, completeConsultation, navigate]
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

  useEffect(() => {
    if (searchParams.get('redirectToDisclosure') && consultation?.disclosureId) {
      setSearchParams(
        (prev) => {
          prev.delete('redirectToDisclosure');
          return prev;
        },
        { replace: true }
      );
      navigate(`/disclosures/${consultation?.disclosureId}`, { replace: true });
    }
  }, [consultation?.disclosureId, navigate, searchParams, setSearchParams]);

  if (!consultation) {
    return null;
  }

  const isPending = consultation.consultationStatus === 'pending';

  return (
    <Card>
      <Stack gap={2} sx={{ position: 'relative' }}>
        <Header title={STRINGS.consulting_adviser} />

        <Stack gap={2}>
          <DetailItem
            icon={<Comment />}
            label={STRINGS.details}
            value={consultation.consultationNote ?? STRINGS.none}
          />
          <DetailItem
            icon={<Person />}
            label={STRINGS.created_By}
            value={consultation.createdBy?.name ?? STRINGS.none}
          />
          <DetailItem
            icon={<PublishedWithChangesIcon />}
            label={STRINGS.status}
            value={getStringsLabel({
              key: 'consulting_adviser',
              val: consultation.consultationStatus || '',
            })}
          />
          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={formatDateTime(consultation.createdAt)}
          />
          {consultation.disclosure?.rating?.code && (
            <DetailItem icon={<ThumbsUpDown />} label={STRINGS.rating} value={consultation.disclosure.rating.code} />
          )}

          {consultation.consultationAudio && (
            <DetailItem
              icon={<VolumeDownIcon />}
              label={''}
              value={
                <Stack direction="row" alignItems="center">
                  <audio
                    controlsList="nodownload"
                    controls
                    src={getVoiceSrc({ baseUrl, filePath: consultation.consultationAudio })}
                  />
                </Stack>
              }
            />
          )}
        </Stack>

        {isPending && currentCanRate && ratings.length > 0 && (
          <>
            <Divider />
            <DetailItem
              icon={<ThumbsUpDown />}
              label={STRINGS.select_rating_quickly}
              value={
                <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap', pt: 1 }}>
                  {ratings?.map((r) => (
                    <Chip
                      key={r.id}
                      label={r.name}
                      color="primary"
                      onClick={() =>
                        handleChipClicked({
                          ratingId: r.id,
                          adviserConsultationId: consultation.id,
                          ratingName: r.code,
                        })
                      }
                    />
                  ))}
                </Stack>
              }
            />
          </>
        )}

        {!isFetching && (error || !consultation) && <Nodata />}
        {(isFetching || isFetchingRatings || isCompleting) && <LoadingOverlay />}
      </Stack>
    </Card>
  );
}

export default ConsultingAdviserDetailsPage;
