import { Stack } from '@mui/material';
import DisclosureCard from '../components/disclosure-card.component';
import { Add, Filter } from '@mui/icons-material';
import { useDisclosuresLoader } from '../hooks/disclosures-loader.hook';
import { useMemo } from 'react';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import {
  defaultDisclosureFilterValues,
  noramlizeStateValuesToDto,
  type TDisclosureFiltersForm,
} from '../helpers/disclosure.helpers';
import useStorage from '@/core/hooks/use-storage.hook';

const DisclosuresPage = () => {
  const { openModal, closeModal } = useModal();

  const [filtersState, setFiltersState] = useStorage<TDisclosureFiltersForm>(
    'disclosure-filters',
    defaultDisclosureFilterValues
  );

  const queryData = useMemo(() => noramlizeStateValuesToDto(filtersState), [filtersState]);

  const navigate = useNavigate();

  const { items, totalCount, error, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useDisclosuresLoader(queryData);

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <VirtualizedList
        totalCount={totalCount}
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: items.length,
        }}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
      >
        {({ item: d }) => <DisclosureCard disclosure={d} key={d.id} />}
      </VirtualizedList>
      <ActionsFab
        actions={[
          {
            label: STRINGS.add_disclosure,
            icon: <Add />,
            onClick: () => navigate('/disclosures/action'),
          },
          {
            label: STRINGS.filter,
            icon: <Filter />,
            onClick: () =>
              openModal({
                name: 'DISCLOSURE_FILTERS_MODAL',
                props: {
                  onSubmit: (values) => {
                    closeModal();
                    return setFiltersState(values);
                  },
                  value: filtersState,
                },
              }),
          },
        ]}
      />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosuresPage;
