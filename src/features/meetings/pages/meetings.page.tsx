import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import meetingsApi from '../api/meetings.api';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { useNavigate } from 'react-router-dom';
import STRINGS from '@/core/constants/strings.constant';
import MeetingCard from '../components/meeting-card.component';
import type { TMeeting } from '../types/meetings.types';

const MeetingsPage = () => {
  const navigate = useNavigate();

  const { data: resp, isLoading } = meetingsApi.useGetMeetingsQuery({});

  const items = resp?.items ?? [];

  const openActionPage = (oldMeeting?: TMeeting) => {
    if (oldMeeting) {
      navigate(`/meetings/action?id=${oldMeeting.id}`);
    } else {
      navigate('/meetings/action');
    }
  };

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <CustomAppBar title={STRINGS.meetings_management} subtitle={STRINGS.add_manage_meetings} />

      <VirtualizedList
        isLoading={isLoading}
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{ count: items.length }}
      >
        {({ item }) => <MeetingCard meeting={item as any} onEdit={(m) => openActionPage(m)} />}
      </VirtualizedList>

      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => openActionPage(),
          },
        ]}
      />
    </Stack>
  );
};

export default MeetingsPage;
