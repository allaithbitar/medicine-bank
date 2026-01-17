import { useNavigate, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import Calendar from '@/features/appointments/components/calendar/calendar.component';
import { useEffect, useState } from 'react';
import { notifyError, notifyInfo, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import WarningNotice from '@/core/components/common/warning-notice/warning-notice.component';
import disclosuresApi from '../api/disclosures.api';
import { skipToken } from '@reduxjs/toolkit/query';

const DisclosureAppointmentActionPage = () => {
  const [searchParams] = useSearchParams();
  const disclosureId = searchParams.get('id');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const { data: disclosure, isLoading: isLoadingDisclosure } = disclosuresApi.useGetDisclosureQuery(
    disclosureId ? { id: disclosureId } : skipToken
  );

  useEffect(() => {
    if (disclosure) {
      setSelectedDate(disclosure.appointmentDate);
    }
  }, [disclosure]);

  const [updateDisclosureAppointment, { isLoading }] = disclosuresApi.useUpdateDisclosureMutation();

  const handleSave = async () => {
    if (!disclosure?.id) return;
    const updateDto = {
      appointmentDate: selectedDate,
      id: disclosure.id,
      isCompleted: false,
    };
    try {
      await updateDisclosureAppointment(updateDto).unwrap();
      notifySuccess(STRINGS.edited_successfully);

      navigate(-1);
    } catch (error) {
      notifyError(error);
    }
  };

  const handleSelectDate = ({ d, c }: { d: string; c?: number }) => {
    setSelectedDate(d);
    if (!!c && c >= 5) {
      notifyInfo(STRINGS.selected_date_cap_warning);
    }
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography sx={{ pt: 1, px: 1 }} variant="body1">
        {disclosure?.appointmentDate ? STRINGS.edit_appointment_date : STRINGS.select_appointment_date}
      </Typography>
      <Calendar selectedDate={selectedDate} onClick={(d, c) => handleSelectDate({ d, c })} />
      <WarningNotice title={STRINGS.warning} message={STRINGS.appointment_warning_message} variant="outlined" />
      <ActionFab color="success" icon={<Save />} disabled={!selectedDate} onClick={handleSave} />
      {(isLoading || isLoadingDisclosure) && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureAppointmentActionPage;
