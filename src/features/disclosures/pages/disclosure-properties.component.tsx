import Header from '@/core/components/common/header/header';
import type { TDisclosure } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import { Button, Card, Divider, Stack, Typography, Tooltip } from '@mui/material';
import CustomBadge from '../components/custom-badge.component';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, DateRange, Archive, Unarchive } from '@mui/icons-material';
import { useCallback } from 'react';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import useDisclosureMutation from '../hooks/disclosure-mutation.hook';
import disclosuresApi from '../api/disclosures.api';

export default function DisclosureProperties({ disclosure }: { disclosure: TDisclosure }) {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { currentCanArchive, currentCanCompleteAppointment } = usePermissions();
  const [archiveDisclosure, { isLoading: isArchiving }] = disclosuresApi.useArchiveDisclosureMutation();
  const [unarchiveDisclosure, { isLoading: isUnarchiving }] = disclosuresApi.useUnarchiveDisclosureMutation();

  const hasVisit = !!disclosure.visitResult;
  const hasRating = !!(disclosure.ratingId || disclosure.customRating);
  // const isDisclosureReceived = disclosure.isReceived === true;
  const isDisclosureAppointmentCompleted = disclosure.isAppointmentCompleted === true;
  const canArchive = hasVisit && hasRating && isDisclosureAppointmentCompleted;
  const isArchived = disclosure.status === 'archived';

  // const [updateDisclosure, { isLoading: isUpdating }] = disclosuresApi.useUpdateDisclosureMutation();
  const [mutateDisclosure, { isLoading: isUpdating }] = useDisclosureMutation();

  const handleCompleteAppointment = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.complete_appointment_confirmation,
        onConfirm: async () => {
          await mutateDisclosure({ type: 'UPDATE', dto: { isAppointmentCompleted: true, id: disclosure.id } });
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleReceiveDisclosure = useCallback(() => {
  //   openModal({
  //     name: 'CONFIRM_MODAL',
  //     props: {
  //       message: STRINGS.receive_disclosure_confirmation,
  //       onConfirm: async () => {
  //         await mutateDisclosure({ type: 'UPDATE', dto: { isReceived: true, id: disclosure.id } });
  //       },
  //     },
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleArchiveDisclosure = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.archive_confirmation,
        onConfirm: async () => {
          try {
            await archiveDisclosure({ id: disclosure.id }).unwrap();
            notifySuccess(STRINGS.action_done_successfully);
          } catch (err: any) {
            notifyError(err);
          }
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclosure.id, archiveDisclosure]);

  const handleUnarchiveDisclosure = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.unarchive_confirmation,
        onConfirm: async () => {
          try {
            await unarchiveDisclosure({ id: disclosure.id }).unwrap();
            notifySuccess(STRINGS.action_done_successfully);
          } catch (err: any) {
            notifyError(err);
          }
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclosure.id, unarchiveDisclosure]);
  const isLoading = isUpdating || isArchiving || isUnarchiving;
  return (
    <Card>
      {isLoading && <LoadingOverlay />}
      <Stack gap={1.5} alignItems="start">
        <Header title={STRINGS.disclosure_properties} />
        <Stack direction="row" sx={{ width: '100%' }} gap={2}>
          <Stack sx={{ width: '100%' }} gap={1}>
            <Card sx={{ px: 2, py: 0.5 }}>
              <Typography textAlign="center">{STRINGS.appointment}</Typography>
            </Card>
            <CustomBadge textAlign="center" colors={isDisclosureAppointmentCompleted ? 'success' : 'warning'}>
              {isDisclosureAppointmentCompleted ? STRINGS.appointment_completed : STRINGS.appointment_not_completed}
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
            disabled={isArchived}
            fullWidth
            onClick={() => navigate(`/disclosures/appointment/action?id=${disclosure.id}`)}
          >
            {STRINGS.select_appointment_date}
          </Button>
          {!isDisclosureAppointmentCompleted && (
            <Button
              disabled={!currentCanCompleteAppointment || isArchived}
              onClick={handleCompleteAppointment}
              fullWidth
              color="success"
              startIcon={<CheckCircle />}
            >
              {STRINGS.appointment_completed}
            </Button>
          )}
        </Stack>

        {/* <Divider flexItem /> */}
        {/* <Stack gap={1} sx={{ width: '100%' }}>
          <Card sx={{ px: 2, py: 0.5 }}>
            <Typography textAlign="center">{STRINGS.the_receive}</Typography>
          </Card>
          <CustomBadge textAlign="center" colors={isDisclosureReceived ? 'success' : 'grey'}>
            {isDisclosureReceived ? STRINGS.is_received : STRINGS.hasnt_been_received_yet}
          </CustomBadge>
        </Stack>
        {!isDisclosureReceived && (
          <>
            <Divider flexItem />
            <Button
              disabled={!currentCanReceiveDisclosure || isArchived}
              onClick={handleReceiveDisclosure}
              startIcon={<CheckCircle />}
              fullWidth
              color="success"
            >
              {STRINGS.is_received}
            </Button>
          </>
        )} */}

        {currentCanArchive && (
          <>
            <Divider flexItem />
            <Tooltip title={!isArchived && !canArchive ? STRINGS.archive_requirements_not_met : ''} arrow>
              <span style={{ width: '100%' }}>
                <Button
                  onClick={isArchived ? handleUnarchiveDisclosure : handleArchiveDisclosure}
                  startIcon={isArchived ? <Unarchive /> : <Archive />}
                  fullWidth
                  color={isArchived ? 'info' : 'warning'}
                  disabled={!isArchived && !canArchive}
                >
                  {isArchived ? STRINGS.unarchive : STRINGS.archive}
                </Button>
              </span>
            </Tooltip>
          </>
        )}
      </Stack>
    </Card>
  );
}
