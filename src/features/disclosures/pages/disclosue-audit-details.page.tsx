import { useMemo, useState } from 'react';
import { Typography, Stack, Divider, Box, Paper, Chip, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import disclosuresApi from '../api/disclosures.api';
import { useLocation, useParams } from 'react-router-dom';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import type { TAuditDetailsRow } from '../types/disclosure.types';
import { ACTION_COLOR_MAP, formatDateTime, getStringsLabel } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import { useEmployeesAutocompleteLoader } from '@/features/autocomplete/hooks/employees-autocomplete-loader.hook';
import type { TAutocompleteItem } from '@/core/types/common.types';
import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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
    data,
    isLoading: isEmployeesLoading,
    isFetching: isEmployeesFetching,
  } = useEmployeesAutocompleteLoader({ pageSize: 1000 });

  const employeeMap = useMemo(() => {
    const map = new Map<string, TAutocompleteItem>();
    for (const e of data?.items || []) {
      map.set(e.id, e);
    }
    return map;
  }, [data?.items]);

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

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderResolvedValue = (item: TAuditDetailsRow, which: 'old' | 'new') => {
    const raw = which === 'old' ? item.oldValue : item.newValue;
    const record = which === 'old' ? item.oldRecordValue : item.newRecordValue;

    if (RAW_COLUMNS.has(item.column ?? '')) {
      if (raw === 'null') return STRINGS.none;
      if (['visit_result', 'status'].includes(item.column ?? '')) return STRINGS[raw as keyof typeof STRINGS];
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
    <Stack gap={1}>
      <CustomAppBarComponent title={STRINGS.audit_details} />
      <Stack spacing={2.5}>
        {sorted.map((entry: TAuditDetailsRow, index: number) => {
          const createdByName = employeeMap.get(entry.createdBy ?? '')?.name;
          const columnLabel = getStringsLabel({
            key: 'update_column',
            val: entry.column || STRINGS.update_column_disclosure_notes,
          });
          const isExpanded = expandedIds.has(entry.id);
          const actionColor = ACTION_COLOR_MAP[entry.action];

          return (
            <Paper
              key={entry.id}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: 'fadeInUp 0.4s ease-out',
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'both',
                '&:hover': {
                  borderColor: actionColor,
                  boxShadow: `0 4px 12px ${actionColor}22`,
                },
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Box
                onClick={() => toggleExpanded(entry.id)}
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'background.paper',
                  borderBottom: isExpanded ? '1px solid' : 'none',
                  borderColor: 'divider',
                  transition: 'background 0.3s ease',
                  '&:hover': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? `linear-gradient(to left, ${actionColor}11, ${theme.palette.background.default})`
                        : `${actionColor}05`,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      borderLeft: '3px solid',
                      borderColor: actionColor,
                      pl: 2,
                      pr: 3,
                    }}
                  >
                    <Typography variant="subtitle1">{columnLabel}</Typography>
                  </Box>

                  <Chip
                    label={getStringsLabel({
                      key: 'update_column_action',
                      val: entry.action.toLocaleLowerCase(),
                    })}
                    size="small"
                    sx={{
                      bgcolor: `${actionColor}22`,
                      color: actionColor,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 26,
                      border: `1px solid ${actionColor}44`,
                    }}
                  />

                  {createdByName && (
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 'auto' }}>
                      <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {createdByName}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <IconButton
                  size="small"
                  sx={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              <Collapse in={isExpanded} timeout={300}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 600,
                        }}
                      >
                        {formatDateTime(entry.createdAt)}
                      </Typography>
                    </Stack>
                    <Divider
                      sx={{
                        borderColor: 'divider',
                        borderStyle: 'dashed',
                      }}
                    />
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          mb: 1.5,
                          pb: 1,
                          borderBottom: '2px solid',
                          borderColor: `${actionColor}33`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'text.secondary',
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                            color: 'text.secondary',
                          }}
                        >
                          {STRINGS.old_value}
                        </Typography>
                      </Stack>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: 'action.hover',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            wordBreak: 'break-word',
                          }}
                        >
                          {renderResolvedValue(entry, 'old') || STRINGS.none}
                        </Typography>
                      </Paper>
                    </Box>

                    <Divider
                      sx={{
                        borderColor: 'divider',
                        borderStyle: 'dashed',
                      }}
                    />

                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          mb: 1.5,
                          pb: 1,
                          borderBottom: '2px solid',
                          borderColor: actionColor,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: actionColor,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                            color: actionColor,
                          }}
                        >
                          {STRINGS.new_value}
                        </Typography>
                      </Stack>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: `${actionColor}11`,
                          border: '1px solid',
                          borderColor: actionColor,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            wordBreak: 'break-word',
                            fontWeight: 600,
                            color: actionColor,
                          }}
                        >
                          {renderResolvedValue(entry, 'new') || STRINGS.none}
                        </Typography>
                      </Paper>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AuditDetailsPage;
