import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import appointmentsApi from "@/features/appointments/api/appointmets.api";
import { Stack, Typography } from "@mui/material";
import Calendar from "@/features/appointments/components/calendar/calendar.component";
import { useState } from "react";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import WarningNotice from "@/core/components/common/warning-notice/warning-notice.component";

const DisclosureAppointmentActionPage = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const preLoadedDate = searchParams.get("date");

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    preLoadedDate ? preLoadedDate : ""
  );

  const [addAppointment, { isLoading: isAddingAppointment }] =
    appointmentsApi.useAddDisclosureAppointmentMutation();

  const [
    updateDisclosureAppointment,
    { isLoading: isUpdateDisclosureAppointment },
  ] = appointmentsApi.useUpdateDisclosureAppointmentMutation();

  const { disclosureId } = useParams();

  const handleSave = async () => {
    if (!disclosureId) return;
    const payload = {
      date: selectedDate,
      disclosureId,
      isCompleted: false,
    };
    try {
      if (appointmentId) {
        const updatePayload = { ...payload, id: appointmentId };
        await updateDisclosureAppointment(updatePayload).unwrap();
        notifySuccess(STRINGS.added_successfully);
      } else {
        await addAppointment(payload).unwrap();
        notifySuccess(STRINGS.edited_successfully);
      }
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
        {appointmentId
          ? STRINGS.edit_appointment_date
          : STRINGS.select_appointment_date}
      </Typography>
      <Calendar
        selectedDate={selectedDate}
        onClick={(d, c) => handleSelectDate({ d, c })}
      />
      <WarningNotice
        title={STRINGS.warning}
        message={STRINGS.appointment_warning_message}
        variant="outlined"
      />
      <ActionFab
        color="success"
        icon={<Save />}
        disabled={!selectedDate}
        onClick={handleSave}
      />
      {isAddingAppointment ||
        (isUpdateDisclosureAppointment && <LoadingOverlay />)}
    </Stack>
  );
};

export default DisclosureAppointmentActionPage;
