import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { useNavigate } from 'react-router-dom';
import STRINGS from '@/core/constants/strings.constant';
import MeetingCard from '../components/meeting-card.component';
import type { TMeeting } from '../types/meetings.types';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import { useMeetingsLoader } from '../hooks/meetings-loader.hook';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import { usePermissions } from '@/core/hooks/use-permissions.hook';

const queryData = { pageSize: DEFAULT_PAGE_SIZE, pageNumber: DEFAULT_PAGE_NUMBER };

const MeetingsPage = () => {
  const navigate = useNavigate();
  const { currentCanAdd, currentCanEdit } = usePermissions();

  const { items, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useMeetingsLoader(queryData);

  const openActionPage = (oldMeeting?: TMeeting) => {
    if (oldMeeting) {
      navigate(`/meetings/action?id=${oldMeeting.id}`);
    } else {
      navigate('/meetings/action');
    }
  };

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <CustomAppBar title={STRINGS.meetings_management} subtitle={STRINGS.add_manage_meetings} />

      <VirtualizedList
        items={items}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
      >
        {({ item }) => <MeetingCard meeting={item} onEdit={currentCanEdit ? (m) => openActionPage(m) : undefined} />}
      </VirtualizedList>
      {currentCanAdd && (
        <ActionsFab
          actions={[
            {
              label: STRINGS.add,
              icon: <Add />,
              onClick: () => openActionPage(),
            },
          ]}
        />
      )}
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default MeetingsPage;
