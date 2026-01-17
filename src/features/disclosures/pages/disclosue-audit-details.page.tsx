import { useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  Chip,
  Stack,
  Divider,
  Box,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import disclosuresApi from '../api/disclosures.api';
import { useLocation, useParams } from 'react-router-dom';
import employeesApi from '@/features/employees/api/employees.api';
import type { TEmployee } from '@/features/employees/types/employee.types';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import type { TAuditDetailsRow } from '../types/disclosure.types';
import { ACTION_COLOR_MAP, formatDateTime, getStringsLabel } from '@/core/helpers/helpers';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';

const RAW_COLUMNS = new Set([
  'is_custom_rating',
  'rating_note',
  'visit_result',
  'visit_reason',
  'visit_note',
  'is_appointment_completed',
  'appointment_date',
  'is_received',
  'status',
  'type',
  'initial_note',
  'archive_number',
  'custom_rating',
]);

const RESOLVE_COLUMNS = new Set(['rating_id', 'scout_id', 'priority_id', 'details']);

function AuditDetailsPage() {
  const { disclosureId } = useParams();
  const { state } = useLocation();
  const date: string = state?.date;

  const {
    data: auditData,
    isLoading: isAuditLoading,
    isFetching: isAuditFetching,
  } = disclosuresApi.useGetAuditDetailsQuery(
    {
      date,
      disclosureId: disclosureId!,
    },
    { skip: !date || !disclosureId }
  );

  const {
    data: { items: employees = [] } = { items: [] },
    isLoading: isEmployeesLoading,
    isFetching: isEmployeesFetching,
  } = employeesApi.useGetEmployeesQuery({ pageSize: 1000 });

  const employeeMap = useMemo(() => {
    const map = new Map<string, TEmployee>();
    if (Array.isArray(employees)) {
      for (const e of employees) map.set(e.id, e);
    }
    return map;
  }, [employees]);

  const loading = isAuditLoading || isAuditFetching || isEmployeesLoading || isEmployeesFetching;

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!auditData || auditData.length === 0) {
    return <Nodata />;
  }

  const sorted = [...auditData].sort(
    (a: TAuditDetailsRow, b: TAuditDetailsRow) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const renderResolvedValue = (item: TAuditDetailsRow, which: 'old' | 'new') => {
    const raw = which === 'old' ? item.oldValue : item.newValue;
    const record = which === 'old' ? item.oldRecordValue : item.newRecordValue;

    if (RAW_COLUMNS.has(item.column ?? '')) {
      if (raw === 'null') return STRINGS.none;
      if (item.column === 'visit_result') return STRINGS[raw as keyof typeof STRINGS];
      if (['true', 'false'].includes(raw))
        return getStringsLabel({
          key: 'common',
          val: raw,
        });
      if (item.column === 'appointment_date') return formatDateTime(raw);
      return raw;
    }

    if (RESOLVE_COLUMNS.has(item.column ?? '')) {
      if (record && (record.name || record.id)) {
        return record.name ?? record.id;
      }
    }
  };

  return (
    <Box p={2}>
      <Header title={STRINGS.audit_details} />
      <List>
        {sorted.map((entry: TAuditDetailsRow) => {
          const createdByName = employeeMap.get(entry.createdBy ?? '')?.name;
          const columnLabel = getStringsLabel({
            key: 'update_column',
            val: entry.column || STRINGS.update_column_disclosure_notes,
          });
          return (
            <ListItem key={entry.id} disableGutters>
              <Box width="100%">
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid
                      container
                      sx={{
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Grid size={5}>
                        <Typography variant="subtitle2">{columnLabel}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Chip
                          label={getStringsLabel({
                            key: 'update_column_action',
                            val: entry.action.toLocaleLowerCase(),
                          })}
                          size="small"
                          sx={{
                            bgcolor: ACTION_COLOR_MAP[entry.action],
                          }}
                        />
                      </Grid>
                      <Grid size={3}>
                        <Typography variant="caption" color="textSecondary">
                          {createdByName}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1} width="100%">
                      <Typography variant="caption" color="textSecondary">
                        {formatDateTime(entry.createdAt)}
                      </Typography>
                      <Divider />
                      <Typography variant="body2" color="textSecondary">
                        {STRINGS.old_value}
                      </Typography>
                      <Typography variant="body1">{renderResolvedValue(entry, 'old')}</Typography>
                      <Divider />
                      <Typography variant="body2" color="textSecondary">
                        {STRINGS.new_value}
                      </Typography>
                      <Typography variant="body1">{renderResolvedValue(entry, 'new')}</Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default AuditDetailsPage;
