import { Stack, Divider, Typography, Button, Chip } from "@mui/material";
import Nodata from "@/core/components/common/no-data/no-data.component";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import { DateRange } from "@mui/icons-material";
import type { TDisclosure } from "@/features/disclosures/types/disclosure.types";

const DisclosureAppointmentTab = ({
  disclosure,
  openEditExtra,
}: {
  disclosure?: TDisclosure;
  openEditExtra?: (
    section: "appointment" | "rating" | "visit" | "visit-rating"
  ) => void;
}) => {
  if (!disclosure) return null;

  return (
    <Stack gap={2} sx={{ p: 2 }}>
      <Stack
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Stack
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Typography>{STRINGS.appointment}</Typography>
          <Chip
            label={
              disclosure.isAppointmentCompleted
                ? STRINGS.appointment_completed
                : STRINGS.appointment_not_completed
            }
            color={disclosure.isAppointmentCompleted ? "primary" : "warning"}
          />
        </Stack>

        {disclosure.appointmentDate && (
          <Button
            onClick={() => openEditExtra && openEditExtra("appointment")}
            startIcon={<DateRange />}
          >
            {STRINGS.edit}
          </Button>
        )}
      </Stack>

      <Divider />

      {!disclosure.appointmentDate ? (
        <Nodata
          extra={
            <Button
              variant="outlined"
              size="small"
              onClick={() => openEditExtra && openEditExtra("appointment")}
            >
              {STRINGS.add}
            </Button>
          }
        />
      ) : (
        <DetailItem
          icon={<DateRange />}
          label={STRINGS.appointment_date}
          value={
            disclosure.appointmentDate
              ? disclosure.appointmentDate
              : STRINGS.none
          }
        />
      )}
    </Stack>
  );
};

export default DisclosureAppointmentTab;
