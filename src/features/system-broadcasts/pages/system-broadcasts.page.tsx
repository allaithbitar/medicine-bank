import { useEffect, useState } from 'react';
import { Box, Stack, Tab, Tabs, ToggleButtonGroup, ToggleButton, Card } from '@mui/material';
import Add from '@mui/icons-material/Add';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import STRINGS from '@/core/constants/strings.constant';
import systemBroadcastsApi from '../api/system-broadcasts.api';
import { BROADCAST_TYPES, type TBroadcastAudience, type TSystemBroadcast } from '../types/system-broadcasts.types';
import SystemBroadcastCard from '../components/system-broadcast-card.component';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { usePermissions } from '@/core/hooks/use-permissions.hook';

const AUDIENCES = ['all', 'scouts', 'supervisors'] as const;

const SystemBroadcastsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get('tab') ?? 0);
  const { currentCanAdd, currentCanEdit, currentShowFilters, currentUserRole } = usePermissions();

  const [audienceFilter, setAudienceFilter] = useState<TBroadcastAudience>();

  const { data: { items: searchResp = [] } = { items: [] }, isFetching: isLoading } =
    systemBroadcastsApi.useSearchSystemBroadcastsQuery(
      {
        type: BROADCAST_TYPES[currentTab],
        audience: [audienceFilter!],
      },
      { skip: !audienceFilter }
    );

  useEffect(() => {
    switch (currentUserRole) {
      case 'manager':
        setAudienceFilter('all');
        break;
      case 'supervisor':
        setAudienceFilter('supervisors');
        break;
      case 'scout':
        setAudienceFilter('scouts');
        break;
      default:
        setAudienceFilter('all');
    }
  }, [currentUserRole]);

  const handleOpenAction = (oldBroadcast?: TSystemBroadcast) => {
    if (oldBroadcast) {
      navigate(`/system-broadcast/action?id=${oldBroadcast.id}`);
    } else {
      navigate('/system-broadcast/action');
    }
  };

  const handleAudienceQuick = (aud: TBroadcastAudience) => {
    setAudienceFilter(aud);
  };

  return (
    <Stack>
      <Card>
        <Stack gap={3}>
          <Tabs
            value={currentTab}
            variant="fullWidth"
            onChange={(_, v) =>
              setSearchParams((prev) => ({ ...prev, tab: v }), {
                replace: true,
              })
            }
            slotProps={{
              indicator: {
                sx: {
                  height: '5%',
                  borderRadius: 10,
                },
              },
            }}
          >
            <Tab label={STRINGS.meetings} />
            <Tab label={STRINGS.custom} />
          </Tabs>

          {currentShowFilters && (
            <ToggleButtonGroup value={audienceFilter} exclusive onChange={(_, v) => v && handleAudienceQuick(v)}>
              {AUDIENCES.map((a) => (
                <ToggleButton key={a} value={a}>
                  {STRINGS[`audience_${a}` as keyof typeof STRINGS] ?? a}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}

          <Box sx={{ flex: 1 }}>
            {searchResp.length === 0 && !isLoading ? (
              <Nodata />
            ) : (
              <VirtualizedList isLoading={isLoading} items={searchResp} containerStyle={{ height: '100%' }}>
                {({ item }) => (
                  <SystemBroadcastCard
                    broadcast={item as TSystemBroadcast}
                    onEdit={currentCanEdit ? (b) => handleOpenAction(b as TSystemBroadcast) : undefined}
                  />
                )}
              </VirtualizedList>
            )}
          </Box>

          {currentCanAdd && (
            <ActionsFab
              actions={[
                {
                  label: STRINGS.add,
                  icon: <Add />,
                  onClick: () => handleOpenAction(),
                },
              ]}
            />
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default SystemBroadcastsPage;
