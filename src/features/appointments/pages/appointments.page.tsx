import { Button, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Check, Visibility } from "@mui/icons-material";
import appointmentsApi from "../api/appointmets.api";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import CardAvatar from "@/core/components/common/reusable-card/card-avatar.component";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import Calendar from "../components/calendar/calendar.component";
import { Link } from "react-router-dom";

// const DAYS = {
//   SUNDAY: 0,
//   MONDAY: 1,
//   TUESDAY: 2,
//   Wednesday: 3,
//   Thursday: 4,
//   FRIDAY: 5,
//   SATURDAY: 6,
// };
//
// const DAYS_REVERSED = {
//   0: "SUNDAY",
//   1: "MONDAY",
//   2: "TUESDAY",
//   3: "Wednesday",
//   4: "Thursday",
//   5: "FRIDAY",
//   6: "SATURDAY",
// };
//
const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const { data: selectedDateAppointments } =
    appointmentsApi.useGetDateAppointmentsQuery(selectedDate, {
      skip: !selectedDate,
    });

  return (
    <Stack gap={2}>
      <Calendar selectedDate={selectedDate} onClick={setSelectedDate} />
      {selectedDate && (
        <>
          <Divider flexItem />
          {selectedDateAppointments?.map((a) => (
            <ReusableCardComponent
              key={a.id}
              headerContent={<CardAvatar name={a.disclosure?.patient.name} />}
              cardSx={{ border: "unset" }}
              bodyContent={
                <Stack gap={1}>
                  {/* <DetailItemComponent
                    icon={<EventAvailable />}
                    label={STRINGS.appointment_date}
                    value={formatDateTime(a.date, false)}
                  />

                  <DetailItemComponent
                    icon={<EventAvailable />}
                    label={STRINGS.created_at}
                    value={formatDateTime(a.createdAt)}
                  />

                  <DetailItemComponent
                    icon={<History />}
                    label={STRINGS.updated_at}
                    value={
                      a.updatedAt ? formatDateTime(a.updatedAt) : STRINGS.none
                    }
                  /> */}

                  <DetailItemComponent
                    icon={<Check />}
                    label={STRINGS.status}
                    value={
                      <Typography
                        variant="subtitle2"
                        color={a.isCompleted ? "success" : "warning"}
                      >
                        {a.isCompleted
                          ? STRINGS.appointment_completed
                          : STRINGS.appointment_not_completed}
                      </Typography>
                    }
                  />
                </Stack>
              }
              footerContent={
                <Link
                  to={`/disclosures/${a.disclosure!.id}`}
                  style={{ marginInlineStart: "auto" }}
                >
                  <Button variant="outlined" startIcon={<Visibility />}>
                    {STRINGS.view}
                  </Button>
                </Link>
              }
            />
          ))}
        </>
      )}
    </Stack>
  );
};

export default AppointmentsPage;
