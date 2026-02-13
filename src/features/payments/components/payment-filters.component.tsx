import { memo, useState } from 'react';
import { Stack, Paper, Button, Collapse } from '@mui/material';
import { CalendarMonth, ExpandMore, ExpandLess } from '@mui/icons-material';
import EmployeesAutocomplete from '@/features/employees/components/employees-autocomplete.component';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import FieldSet from '@/core/components/common/fieldset/fieldset.component';
import STRINGS from '@/core/constants/strings.constant';
import { EmployeeRole } from '@/features/employees/types/employee.types';
import type { TAutocompleteItem } from '@/core/types/common.types';

interface IPaymentFiltersProps {
  scout: TAutocompleteItem | null;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  onScoutChange: (scout: TAutocompleteItem | null) => void;
  onDateFromChange: (dateFrom: string | null) => void;
  onDateToChange: (dateTo: string | null) => void;
}
const PaymentFilters = ({
  scout,
  dateFrom,
  dateTo,
  onScoutChange,
  onDateFromChange,
  onDateToChange,
}: IPaymentFiltersProps) => {
  const [showDateRange, setShowDateRange] = useState(false);
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack gap={2}>
        <EmployeesAutocomplete
          roles={[EmployeeRole.scout]}
          label={STRINGS.the_scout}
          value={scout}
          onChange={onScoutChange}
          required
        />
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          endIcon={showDateRange ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setShowDateRange(!showDateRange)}
          fullWidth
          sx={{ justifyContent: 'space-between' }}
        >
          {STRINGS.date_range} ({STRINGS.select_date_range_optional})
        </Button>
        <Collapse in={showDateRange}>
          <FieldSet label={STRINGS.date_range}>
            <Stack gap={1}>
              <FormDateInput label={STRINGS.from_date} value={dateFrom} onChange={onDateFromChange} />
              <FormDateInput label={STRINGS.to_date} value={dateTo} onChange={onDateToChange} />
            </Stack>
          </FieldSet>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default memo(PaymentFilters);
