import { Box, ButtonBase, Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import { format, getDaysInMonth } from 'date-fns';
import { useMemo, useState } from 'react';
import { ar } from 'date-fns/locale';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import useScreenSize from '@/core/hooks/use-screen-size.hook';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import disclosuresApi from '@/features/disclosures/api/disclosures.api';

const CalendarItem = ({
  dayName,
  dayNumber,
  appointmentsCount,
  onClick,
  isSelected,
}: {
  dayNumber: number;
  dayName: string;
  appointmentsCount?: number;
  onClick?: () => void;
  isSelected: boolean;
}) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      borderRadius: (theme) => `${theme.shape.borderRadius}px`,
      p: 0,
    }}
  >
    <Card
      sx={{
        aspectRatio: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
        borderWidth: 3,
        ...(isSelected && {
          borderColor: (theme) => theme.palette.success.main,
        }),
      }}
    >
      <Chip
        label={appointmentsCount}
        slotProps={{
          root: {
            sx: {
              bgcolor: (theme) => theme.palette.primary.dark,
              color: (theme) => theme.palette.primary.contrastText,
              position: 'absolute',
              top: -3,
              left: -3,
              zIndex: 2,
              height: 'auto',
              width: 20,
            },
          },
          label: { sx: { p: 0 } },
        }}
      />
      <Typography gutterBottom={false} sx={{ fontSize: '1.4rem' }}>
        {dayNumber}
      </Typography>
      <Typography gutterBottom={false} color="textSecondary" sx={{ fontSize: '0.7rem' }}>
        {dayName}
      </Typography>
    </Card>
  </ButtonBase>
);

const Calendar = ({
  selectedDate,
  onClick,
}: {
  selectedDate?: string;
  onClick: (value: string, count?: number) => void;
}) => {
  const [state, setState] = useState(() => {
    const currentDate = new Date();
    return {
      year: currentDate.getUTCFullYear(),
      month: currentDate.getUTCMonth(),
      day: currentDate.getUTCDay(),
    };
  });

  const selectedMonthDaysCount = useMemo(
    () => getDaysInMonth(new Date(state.year, state.month)),
    [state.month, state.year]
  );

  const months = useMemo(() => {
    const date = new Date();
    return Array.from({ length: 12 }).map((_, idx) => {
      date.setMonth(idx);
      return {
        id: idx.toString(),
        label: format(date, 'M - MMM', { locale: ar }),
      };
    });
  }, []);

  const selectedMonth = useMemo(() => months.find((m) => m.id === String(state.month)), [months, state.month]);

  const { data: calendarAppointments } = disclosuresApi.useGetAppointmentsQuery({
    fromDate: `${state.year}-${state.month + 1}-${1}`,
    toDate: `${state.year}-${state.month + 1}-${selectedMonthDaysCount}`,
  });

  const { isTablet } = useScreenSize();

  return (
    <Card>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" gap={2}>
          <IconButton
            sx={{ flexShrink: 0 }}
            disabled={state.month === 0}
            onClick={() => setState((prev) => ({ ...prev, month: prev.month - 1 }))}
          >
            <ChevronRight />
          </IconButton>
          <FormAutocompleteInput
            disableClearable
            value={selectedMonth}
            options={months}
            onChange={(v) => setState((prev) => ({ ...prev, month: Number(v?.id) }))}
          />
          <IconButton
            sx={{ flexShrink: 0 }}
            disabled={state.month === 11}
            onClick={() => setState((prev) => ({ ...prev, month: prev.month + 1 }))}
          >
            <ChevronLeft />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isTablet ? 'repeat(8,1fr)' : 'repeat(4,1fr)',
            gap: 0.8,
          }}
        >
          {Array.from({ length: selectedMonthDaysCount }).map((_, idx) => {
            const currentDate = new Date(state.year, state.month, idx + 1);
            const dayName = format(currentDate, 'EEEE', { locale: ar });
            const formatted = format(currentDate, 'yyyy-MM-dd');
            const count = calendarAppointments?.[formatted]?.length ?? undefined;

            return (
              <CalendarItem
                isSelected={selectedDate === formatted}
                key={idx}
                dayName={dayName}
                dayNumber={idx + 1}
                appointmentsCount={count}
                onClick={() => onClick(formatted, count)}
              />
            );
          })}
        </Box>
      </Stack>
    </Card>
  );
};

export default Calendar;
