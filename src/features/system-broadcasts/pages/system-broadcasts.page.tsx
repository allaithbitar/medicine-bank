import { useState } from 'react';
import { Box, Stack, Tab, Tabs, ToggleButtonGroup, ToggleButton, Card } from '@mui/material';
import Add from '@mui/icons-material/Add';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import STRINGS from '@/core/constants/strings.constant';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';

import systemBroadcastsApi from '../api/system-broadcasts.api';
import { BROADCAST_TYPES, type TBroadcastAudience, type TSystemBroadcast } from '../types/system-broadcasts.types';
import SystemBroadcastCard from '../components/system-broadcast-card.component';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AUDIENCES = ['all', 'scouts', 'supervisors'] as const;

const SystemBroadcastsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get('tab') ?? 0);

  const [audienceFilter, setAudienceFilter] = useState<TBroadcastAudience>('all');

  const { data: { items: searchResp = [] } = { items: [] }, isFetching: isLoading } =
    systemBroadcastsApi.useSearchSystemBroadcastsQuery({
      type: BROADCAST_TYPES[currentTab],
      audience: [audienceFilter],
    });

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
    <Card sx={{ height: '100%' }}>
      <Stack gap={3} sx={{ height: '100%' }}>
        <Tabs
          sx={{ mt: 2, px: 2 }}
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

        <Box sx={{ px: 2 }}>
          <ToggleButtonGroup value={audienceFilter} exclusive onChange={(_, v) => v && handleAudienceQuick(v)}>
            {AUDIENCES.map((a) => (
              <ToggleButton key={a} value={a}>
                {STRINGS[`audience_${a}` as keyof typeof STRINGS] ?? a}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ px: 2, flex: 1 }}>
          {searchResp.length === 0 && !isLoading ? (
            <ReusableCardComponent
              headerContent={<Box />}
              headerBackground={`linear-gradient(to right, #ccc, #eee)`}
              bodyContent={
                <Stack gap={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                  <RecordVoiceOverOutlinedIcon fontSize="large" />
                  <div>{STRINGS.no_data_found}</div>
                </Stack>
              }
            />
          ) : (
            <VirtualizedList
              isLoading={isLoading}
              items={searchResp}
              containerStyle={{
                height: '90vh',
              }}
              virtualizationOptions={{ count: searchResp.length }}
            >
              {({ item }) => (
                <SystemBroadcastCard
                  broadcast={item as TSystemBroadcast}
                  onEdit={(b) => handleOpenAction(b as TSystemBroadcast)}
                />
              )}
            </VirtualizedList>
          )}
        </Box>

        <ActionsFab
          actions={[
            {
              label: STRINGS.add,
              icon: <Add />,
              onClick: () => handleOpenAction(),
            },
          ]}
        />
      </Stack>
    </Card>
  );
};

export default SystemBroadcastsPage;
