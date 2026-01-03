import { Button, Stack } from '@mui/material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import useUser from '@/core/hooks/user-user.hook';
import disclosuresApi from '../api/disclosures.api';
import { ConsultingAdviserCard } from './consulting-adviser-card.component';
import type { TDisclosureAdviserConsultation } from '../types/disclosure.types';
import { useCallback } from 'react';
import { notifyInfo } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import { useNavigate } from 'react-router-dom';
import { Edit } from '@mui/icons-material';

const DisclosureConsultingAdviserCards = ({ disclosureId }: { disclosureId?: string }) => {
  const { id: currentUserId } = useUser();
  const navigate = useNavigate();
  const { data: response = { items: [] }, isFetching } = disclosuresApi.useGetDisclosureAdviserConsultationsQuery(
    { disclosureId: disclosureId!, createdBy: currentUserId },
    { skip: !disclosureId || !currentUserId }
  );
  const adviserConsultations = response.items ?? [];

  const handleEditClick = useCallback(
    (adviserConsultation: TDisclosureAdviserConsultation) => {
      const consultingNoteCreatorId = (adviserConsultation.createdBy as any)?.id ?? adviserConsultation.createdBy;
      const hasAccess = consultingNoteCreatorId === currentUserId;
      if (hasAccess) {
        navigate(`/disclosures/${adviserConsultation.disclosureId}/consulting_adviser/action`, {
          state: { oldConsultingNote: adviserConsultation },
        });
      } else {
        notifyInfo(STRINGS.no_access);
      }
    },
    [currentUserId, navigate]
  );

  return (
    <Stack gap={2}>
      {adviserConsultations.map((ac) => (
        <ConsultingAdviserCard
          footerContent={
            <Button
              sx={{ placeSelf: 'end' }}
              disabled={ac.consultationStatus === 'completed'}
              onClick={() => handleEditClick(ac)}
              startIcon={<Edit />}
            >
              {STRINGS.edit}
            </Button>
          }
          key={ac.id}
          adviserConsultation={ac}
        />
      ))}
      {!isFetching && !adviserConsultations.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureConsultingAdviserCards;
