import Header from '@/core/components/common/header/header';
import type { TDisclosure } from '../types/disclosure.types';
import STRINGS from '@/core/constants/strings.constant';
import { Button, Card, Divider, Stack, Typography } from '@mui/material';
import CustomBadge from '../components/custom-badge.component';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, DateRange } from '@mui/icons-material';

export default function DisclosureProperties({ disclosure }: { disclosure: TDisclosure }) {
  const navigate = useNavigate();
  return (
    <Card>
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
            <Button fullWidth color="success" startIcon={<CheckCircle />}>
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
            <Button startIcon={<CheckCircle />} fullWidth color="success">
              {STRINGS.is_received}
            </Button>
          </>
        )}
      </Stack>
    </Card>
  );
}
