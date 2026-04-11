import { useMemo } from 'react';
import { Box, Stack, Typography, Paper, Divider, Chip, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
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
  const theme = useTheme();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    disclosuresApi.useGetAuditLogInfiniteQuery(
      { disclosureId },
      { skip: !disclosureId, refetchOnMountOrArgChange: true }
    );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const enriched = useMemo(() => {
    const groups = data?.pages.map((p) => p.items).flat() ?? [];
    return groups.map((g) => {
      const dominant = getDominantAction(g);
      const color = ACTION_COLOR_MAP[dominant] ?? ACTION_COLOR_MAP.DEFAULT;
      return { group: g, dominant, color };
    });
  }, [data]);

  const handleOpenDetails = (date: string) => {
    navigate(`/disclosures/${disclosureId}/audit/details`, { state: { date } });
  };

  return (
    <Stack gap={1} sx={{ height: '100%' }}>
      <Header title={STRINGS.audit_log} showBackButton sx={{ bgcolor: theme.palette.background.default }} />
      {isLoading && !isFetchingNextPage && <LoadingOverlay />}

      <VirtualizedList
        totalCount={totalCount}
        items={enriched}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
        emptyMessage={STRINGS.no_data_found}
      >
        {({ item: { group, color, dominant }, index }) => (
          <Box
            key={group.createdAt}
            sx={{
              position: 'relative',
              animation: 'fadeInUp 0.5s ease-out',
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both',
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
            <Paper
              elevation={0}
              onClick={() => handleOpenDetails(group.createdAt)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="h6"
                    sx={{
                      letterSpacing: '0.02em',
                    }}
                  >
                    {STRINGS.action_type}
                  </Typography>
                  <Chip
                    label={getStringsLabel({
                      key: 'update_column_action',
                      val: dominant.toLowerCase(),
                    })}
                    size="small"
                    sx={{
                      bgcolor: `${color}22`,
                      color: color,
                      fontWeight: 600,
                      border: `1px solid ${color}44`,
                      fontSize: '0.75rem',
                      height: 24,
                    }}
                  />
                </Stack>
                <Divider sx={{ borderColor: 'divider', opacity: 0.5 }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'text.secondary',
                      fontWeight: 600,
                      mb: 1,
                      display: 'block',
                    }}
                  >
                    {STRINGS.edited_fields}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {group?.logs.map(({ column, id }) => (
                      <Chip
                        key={id}
                        label={getStringsLabel({
                          key: 'update_column',
                          val: column || STRINGS.update_column_disclosure_notes,
                        })}
                        size="small"
                        sx={{
                          bgcolor: 'action.hover',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          height: 28,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
                <Divider />
                <Stack gap={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {STRINGS.changes_at} :
                    </Typography>
                    <Typography variant="body2">{formatDateTime(group.createdAt)}</Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      color: color,
                      fontWeight: 700,
                      placeSelf: 'flex-end',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textDecoration: 'underline',
                      textDecorationThickness: '2px',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    {STRINGS.details} ←
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        )}
      </VirtualizedList>
    </Stack>
  );
};

export default DisclosureAuditTimelinePage;
