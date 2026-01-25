import { useNavigate } from 'react-router-dom';
import BeneficiaryCard from '../components/beneficiary-card.component';
import { Add, Filter } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { Stack } from '@mui/material';
import { useBeneficiariesLoader } from '../hooks/use-beneficiaries-loader.hook';
import { useState } from 'react';
import type { TGetBeneficiariesDto } from '../types/beneficiary.types';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import ErrorCard from '@/core/components/common/error-card/error-card.component';

const BeneficiariesPage = () => {
  const [queryData, setQueryData] = useState<TGetBeneficiariesDto>({});
  const { openModal, closeModal } = useModal();
  const {
    items = [],
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useBeneficiariesLoader(queryData);

  // const filtersRef = useRef<TBeneficiariesFiltersHandlers | null>(null);

  const navigate = useNavigate();

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <VirtualizedList
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: items.length,
        }}
      >
        {({ item: b }) => {
          return <BeneficiaryCard beneficiary={b} key={b.id} onEnterClick={navigate} />;
        }}
      </VirtualizedList>
      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.add_beneficiary,
            onClick: () => navigate('/beneficiaries/action'),
          },
          {
            icon: <Filter />,
            label: STRINGS.filter,
            onClick: () =>
              openModal({
                name: 'BENEFICIARIES_FILTERS_MODAL',
                props: {
                  onSubmit: (values) => {
                    closeModal();
                    return setQueryData((prev) => ({ ...prev, ...values }));
                  },
                },
              }),
          },
        ]}
      />

      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default BeneficiariesPage;
