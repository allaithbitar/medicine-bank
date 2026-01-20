import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import SearchFilter from '@/core/components/common/search-filter/search-filter.component';
import CitiesList from '../../components/cities/cities-list/cities-list.component';
import type { TCity } from '../../types/city.types';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import { Add } from '@mui/icons-material';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { useNavigate } from 'react-router-dom';
import { useCitiesLoader } from '@/features/cities/hooks/cities-loader.hook';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import CityCard from '../../components/cities/city-card/city-card.component';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';

const CitiesPage = () => {
  const navigate = useNavigate();

  const [queryData, setQueryData] = useState({
    pageSize: DEFAULT_PAGE_SIZE,
    pageNumber: DEFAULT_PAGE_NUMBER,
    name: '',
  });
  const { items, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useCitiesLoader(queryData);

  const handleOpenCityActionPage = (oldCity?: TCity) => {
    if (oldCity) {
      navigate(`/cities/action?id=${oldCity?.id}`);
    } else {
      navigate(`/cities/action`);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setQueryData((prev) => ({ ...prev, name: query }));
  }, []);

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <CustomAppBar
        title={STRINGS.city_management}
        subtitle={STRINGS.add_and_manage_cities}
        children={
          <SearchFilter initialQuery={queryData.name} onSearch={handleSearch} placeholder={STRINGS.search_city} />
        }
      />
      <VirtualizedList
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: items.length,
        }}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
      >
        {({ item: city }) => <CityCard city={city} key={city.id} onEdit={() => handleOpenCityActionPage(city)} />}
      </VirtualizedList>
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenCityActionPage(),
          },
        ]}
      />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default CitiesPage;
