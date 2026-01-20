import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import WorkAreasAppBar from '../../components/work-areas/work-area-hidder/work-area-hidder.components';
import type { TArea } from '../../types/work-areas.types';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { Add } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import type { TCity } from '../../types/city.types';
import { useNavigate } from 'react-router-dom';
import { useAreasLoader } from '@/features/areas/hooks/areas-loader.hook';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import WorkAreaCardComponent from '../../components/work-areas/work-area-card/work-area-card.component';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';

const WorkAreas = () => {
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState<TCity | null>(null);
  const [queryData, setQueryData] = useState({
    pageSize: DEFAULT_PAGE_SIZE,
    pageNumber: DEFAULT_PAGE_NUMBER,
    name: '',
  });

  const { items, error, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useAreasLoader({
    ...queryData,
    cityId: selectedCity?.id ?? '',
  });

  const handleSearch = useCallback((query: string) => {
    setQueryData((prev) => ({ ...prev, name: query }));
  }, []);

  const handleOpenWorkAreaActionPage = (oldWorkArea?: TArea) => {
    if (oldWorkArea) {
      navigate(`/work-areas/action?id=${oldWorkArea.id}`);
    } else {
      navigate(`/work-areas/action`);
    }
  };

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <Stack gap={1} sx={{ height: '100%' }}>
      <WorkAreasAppBar handleSearch={handleSearch} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      <VirtualizedList
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: items.length,
        }}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
      >
        {({ item: wa }) => <WorkAreaCardComponent workArea={wa} onEdit={() => handleOpenWorkAreaActionPage(wa)} />}
      </VirtualizedList>
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenWorkAreaActionPage(),
          },
        ]}
      />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default WorkAreas;
