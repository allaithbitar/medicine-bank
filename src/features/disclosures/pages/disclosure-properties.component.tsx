import Header from '@/core/components/common/header/header';
import type { TDisclosure } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import { Button, Card, Divider, Stack, Typography } from '@mui/material';
import CustomBadge from '../components/custom-badge.component';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, DateRange } from '@mui/icons-material';
import { useCallback } from 'react';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import disclosuresApi from '../api/disclosures.api';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';

export default function DisclosureProperties({ disclosure }: { disclosure: TDisclosure }) {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [updateDisclosure, { isLoading: isUpdating }] = disclosuresApi.useUpdateDisclosureMutation();

  const handleCompleteAppointment = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.complete_appointment_confirmation,
        onConfirm: async () => {
          await updateDisclosure({ isAppointmentCompleted: true, id: disclosure.id });
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReceiveDisclosure = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.receive_disclosure_confirmation,
        onConfirm: async () => {
          await updateDisclosure({ isReceived: true, id: disclosure.id });
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      {isUpdating && <LoadingOverlay />}
      <Stack gap={1.5} alignItems="start">
        <Header title={STRINGS.disclosure_properties} />
        <Stack direction="row" sx={{ width: '100%' }} gap={2}>
          <Stack sx={{ width: '100%' }} gap={1}>
            <Card sx={{ px: 2, py: 0.5 }}>
              <Typography textAlign="center">{STRINGS.appointment}</Typography>
            </Card>
            <CustomBadge textAlign="center" colors={disclosure.isAppointmentCompleted ? 'success' : 'warning'}>
              {disclosure.isAppointmentCompleted ? STRINGS.appointment_completed : STRINGS.appointment_not_completed}
            </CustomBadge>
          </Stack>
          <Stack sx={{ width: '100%' }} gap={1}>
            <Card sx={{ px: 2, py: 0.5 }}>
              <Typography textAlign="center">{STRINGS.appointment_date}</Typography>
            </Card>
            <CustomBadge textAlign="center" colors={disclosure.appointmentDate ? 'info' : 'grey'}>
              {disclosure.appointmentDate || STRINGS.none}
            </CustomBadge>
          </Stack>
        </Stack>

        <Divider flexItem />
        <Stack direction="row" sx={{ width: '100%', alignItems: 'stretch' }} gap={1}>
          <Button
            startIcon={<DateRange />}
            fullWidth
            onClick={() => navigate(`/disclosures/appointment/action`, { state: disclosure })}
          >
            {STRINGS.select_appointment_date}
          </Button>
          {!disclosure.isAppointmentCompleted && (
            <Button onClick={handleCompleteAppointment} fullWidth color="success" startIcon={<CheckCircle />}>
              {STRINGS.appointment_completed}
            </Button>
          )}
        </Stack>

        <Divider flexItem />
        <Stack gap={1} sx={{ width: '100%' }}>
          <Card sx={{ px: 2, py: 0.5 }}>
            <Typography textAlign="center">{STRINGS.the_receive}</Typography>
          </Card>
          <CustomBadge textAlign="center" colors={disclosure.isReceived ? 'success' : 'grey'}>
            {disclosure.isReceived ? STRINGS.is_received : STRINGS.hasnt_been_received_yet}
          </CustomBadge>
        </Stack>
        {!disclosure.isReceived && (
          <>
            <Divider flexItem />
            <Button onClick={handleReceiveDisclosure} startIcon={<CheckCircle />} fullWidth color="success">
              {STRINGS.is_received}
            </Button>
          </>
        )}
      </Stack>
    </Card>
  );
}
