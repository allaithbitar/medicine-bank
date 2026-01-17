import { useMemo } from 'react';
import { Box, Stack, Typography, Paper } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import type { TAuditGroup } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import { ACTION_COLOR_MAP, formatDateTime, getStringsLabel } from '@/core/helpers/helpers';

const getDominantAction = (group: TAuditGroup) => {
  const counts: Record<string, number> = {};
  for (const l of group.logs) {
    const a = (l.action_type ?? (l as any).action ?? 'UPDATE').toUpperCase();
    counts[a] = (counts[a] || 0) + 1;
  }
  if (counts.DELETE) return 'DELETE';
  if (counts.INSERT) return 'INSERT';
  if (counts.UPDATE) return 'UPDATE';
  const entries = Object.entries(counts);
  if (entries.length === 0) return 'DEFAULT';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
};

const DisclosureAuditTimelinePage = () => {
  const navigate = useNavigate();
  const { disclosureId } = useParams();

  const { data: { items: groups = [] } = { items: [] }, isLoading } = disclosuresApi.useGetAuditLogQuery(
    { disclosureId },
    { skip: !disclosureId, refetchOnMountOrArgChange: true }
  );

  const enriched = useMemo(
    () =>
      groups.map((g) => {
        const dominant = getDominantAction(g);
        const color = ACTION_COLOR_MAP[dominant] ?? ACTION_COLOR_MAP.DEFAULT;
        return { group: g, dominant, color };
      }),
    [groups]
  );

  const handleOpenDetails = (date: string) => {
    navigate(`/disclosures/${disclosureId}/audit/details`, { state: { date } });
  };

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <CustomAppBar title={STRINGS.audit_log} subtitle={STRINGS.view_audit_log} />

      <Box sx={{ px: 2, flex: 1, overflow: 'auto' }}>
        {isLoading && <LoadingOverlay />}

        {!isLoading && groups.length === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography>{STRINGS.no_data_found}</Typography>
          </Paper>
        )}

        {!isLoading && groups.length > 0 && (
          <Timeline position="right">
            {enriched.map(({ group, color }) => (
              <TimelineItem key={group.createdAt}>
                <TimelineOppositeContent
                  style={{
                    maxWidth: '1px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}
                />
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      bgcolor: color,
                      width: 18,
                      height: 18,
                      border: '3px solid rgba(255,255,255,0.08)',
                      boxShadow: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleOpenDetails(group.createdAt)}
                    aria-label={`audit-${group.createdAt}`}
                  />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Paper
                    elevation={1}
                    sx={{ p: 2, cursor: 'pointer' }}
                    onClick={() => handleOpenDetails(group.createdAt)}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack sx={{ gap: 1, width: '100%' }}>
                        <Typography
                          sx={{
                            textAlign: 'start',
                          }}
                          variant="subtitle2"
                        >
                          {STRINGS.edit_done}
                        </Typography>
                        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                          {group?.logs.map(({ column, id }) => (
                            <Typography key={id} variant="caption" color="textDisabled">
                              {getStringsLabel({
                                key: 'update_column',
                                val: column || STRINGS.update_column_disclosure_notes,
                              })}
                            </Typography>
                          ))}
                        </Stack>

                        <Typography
                          sx={{
                            textAlign: 'start',
                          }}
                          variant="subtitle2"
                        >
                          {STRINGS.changes_at}
                        </Typography>
                        <Typography variant="caption" color="textDisabled">
                          {formatDateTime(group.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          {/* {getEmployeeName(group.)} */}
                        </Typography>
                        <Typography sx={{ pt: 1, textAlign: 'start' }} color="primary" variant="subtitle2">
                          {STRINGS.details}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Box>
    </Stack>
  );
};

export default DisclosureAuditTimelinePage;
