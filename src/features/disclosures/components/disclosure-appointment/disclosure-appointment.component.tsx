import appointmentsApi from "@/features/appointments/api/appointmets.api";
import { Button, Stack, Typography } from "@mui/material";
import Nodata from "@/core/components/common/no-data/no-data.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import type { TGetDisclosureAppointmentsResponse } from "@/features/appointments/types/appointment.type";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import { Check, Edit, EventAvailable, History } from "@mui/icons-material";
import { amber, green, orange, teal } from "@mui/material/colors";
import { formatDateTime } from "@/core/helpers/helpers";
import { Link } from "react-router-dom";

const AppointmentCard = ({
  disclosureAppointment,
}: {
  disclosureAppointment: TGetDisclosureAppointmentsResponse;
}) => {
  return (
    <ReusableCardComponent
      headerBackground={
        disclosureAppointment.isCompleted
          ? `linear-gradient(to right, ${teal[400]}, ${green[500]})`
          : `linear-gradient(to right, ${orange[400]}, ${amber[400]})`
      }
      headerContent={
        <Stack>
          <Typography color="white">
            {formatDateTime(disclosureAppointment.date)}
          </Typography>
        </Stack>
      }
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={`${formatDateTime(disclosureAppointment.createdAt)} ${
              STRINGS.by
            } ${disclosureAppointment.createdBy?.name}`}
          />
          <DetailItemComponent
            icon={<Check />}
            label={STRINGS.status}
            value={
              <Typography
                variant="subtitle2"
                color={
                  disclosureAppointment.isCompleted ? "success" : "warning"
                }
              >
                {disclosureAppointment.isCompleted
                  ? STRINGS.appointment_completed
                  : STRINGS.appointment_not_completed}
              </Typography>
            }
          />
          <DetailItemComponent
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              disclosureAppointment.updatedAt ===
              disclosureAppointment.createdAt
                ? STRINGS.none
                : `${formatDateTime(disclosureAppointment.updatedAt)} ${
                    STRINGS.by
                  } ${disclosureAppointment.updatedBy?.name}`
            }
          />
        </Stack>
      }
      footerContent={
        <Link
          style={{ alignSelf: "end" }}
          to={`/disclosures/${disclosureAppointment.disclosureId}/appointment/action?appointmentId=${disclosureAppointment.id}&date=${disclosureAppointment.date}`}
        >
          <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
        </Link>
      }
    />
  );
};

function DisclosureAppointment({ disclosureId }: { disclosureId?: string }) {
  const { data: disclosureAppointments = [], isFetching } =
    appointmentsApi.useGetDisclosureAppointmentsQuery(
      { disclosureId: disclosureId! },
      { skip: !disclosureId }
    );
  return (
    <Stack gap={2} sx={{ position: "relative" }}>
      {disclosureAppointments.map((a) => (
        <AppointmentCard key={a.id} disclosureAppointment={a} />
      ))}
      {!isFetching && !disclosureAppointments.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
}

export default DisclosureAppointment;
