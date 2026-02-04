import { useNavigate } from 'react-router-dom';
import BeneficiaryCard from '../components/beneficiary-card.component';
import { Add, Filter } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { Card, Stack } from '@mui/material';
import { useBeneficiariesLoader } from '../hooks/use-beneficiaries-loader.hook';
import { useMemo } from 'react';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import useStorage from '@/core/hooks/use-storage.hook';
import { defaultBeneficiaryFilterValues, normalizeStateValuesToDto } from '../helpers/beneficiary.helpers';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import Header from '@/core/components/common/header/header';

const BeneficiariesPage = () => {
  const [filters, setFilters] = useStorage('beneficiary-filtres', defaultBeneficiaryFilterValues);
  const { currentCanAdd } = usePermissions();

  const { openModal, closeModal } = useModal();

  const queryData = useMemo(() => normalizeStateValuesToDto(filters), [filters]);

  const {
    items = [],
    totalCount,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useBeneficiariesLoader(queryData);

  // const filtersRef = useRef<TBeneficiariesFiltersHandlers | null>(null);

  const navigate = useNavigate();

  if (error) {
    return <ErrorCard error={error} />;
  }

  const actions = [];

  if (currentCanAdd) {
    actions.push({
      icon: <Add />,
      label: STRINGS.add_beneficiary,
      onClick: () => navigate('/beneficiaries/action'),
    });
  }

  actions.push({
    icon: <Filter />,
    label: STRINGS.filter,
    onClick: () =>
      openModal({
        name: 'BENEFICIARIES_FILTERS_MODAL',
        props: {
          onSubmit: (values) => {
            closeModal();
            return setFilters(values);
          },
          values: filters,
        },
      }),
  });

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <Card sx={{ p: 1 }}>
        <Header title={STRINGS.beneficiaries} />

        <VirtualizedList
          totalCount={totalCount}
          onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
          isLoading={isFetchingNextPage}
          items={items}
        >
          {({ item: b }) => {
            return <BeneficiaryCard beneficiary={b} key={b.id} onEnterClick={navigate} />;
          }}
        </VirtualizedList>
        <ActionsFab actions={actions} />

        {isFetching && !isFetchingNextPage && <LoadingOverlay />}
      </Card>
    </Stack>
  );
};

export default BeneficiariesPage;
