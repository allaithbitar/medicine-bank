import { useMemo, useState } from 'react';
import { Stack, Tabs, Tab } from '@mui/material';
import { Payment } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { useEligiblePaymentsLoader, usePaymentHistoryLoader } from '../hooks/payments-loader.hook';
import useMarkAsPaid from '../hooks/use-mark-as-paid.hook';
import PaymentFilters from '../components/payment-filters.component';
import PaymentTabContent from '../components/payment-tab-content.component';
import { notifyError } from '@/core/components/common/toast/toast';
import type { TAutocompleteItem } from '@/core/types/common.types';

type TPaymentFilters = {
  scout: TAutocompleteItem | null;
  dateFrom: string | undefined;
  dateTo: string | undefined;
};

const defaultFilters: TPaymentFilters = {
  scout: null,
  dateFrom: undefined,
  dateTo: undefined,
};

const PaymentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get('tab') ?? 0);
  const [eligibleFilters, setEligibleFilters] = useState<TPaymentFilters>(defaultFilters);
  const [historyFilters, setHistoryFilters] = useState<TPaymentFilters>(defaultFilters);
  const { markAsPaid, isMarking } = useMarkAsPaid();

  const activeFilters = currentTab === 0 ? eligibleFilters : historyFilters;
  const setActiveFilters = currentTab === 0 ? setEligibleFilters : setHistoryFilters;
  const queryDto = useMemo(
    () => ({
      scoutIds: activeFilters.scout ? [activeFilters.scout.id] : undefined,
      dateFrom: activeFilters.dateFrom ?? undefined,
      dateTo: activeFilters.dateTo ?? undefined,
    }),
    [activeFilters]
  );
  const eligibleData = useEligiblePaymentsLoader(
    currentTab === 0 && activeFilters.scout ? queryDto : { pageSize: 0, pageNumber: 0 }
  );
  const historyData = usePaymentHistoryLoader(
    currentTab === 1 && activeFilters.scout ? queryDto : { pageSize: 0, pageNumber: 0 }
  );
  const activeData = currentTab === 0 ? eligibleData : historyData;
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSearchParams({ tab: newValue.toString() }, { replace: true });
  };
  const handleMarkAsPaid = () => {
    if (!eligibleFilters.scout) {
      notifyError(STRINGS.no_scout_selected);
      return;
    }
    markAsPaid({
      scoutId: eligibleFilters.scout.id,
      dateFrom: eligibleFilters.dateFrom,
      dateTo: eligibleFilters.dateTo,
    });
  };
  const handleScoutChange = (scout: TAutocompleteItem | null) => {
    setActiveFilters((prev) => ({ ...prev, scout }));
  };
  const handleDateFromChange = (dateFrom: string | null) => {
    setActiveFilters((prev) => ({ ...prev, dateFrom: dateFrom || undefined }));
  };
  const handleDateToChange = (dateTo: string | null) => {
    setActiveFilters((prev) => ({ ...prev, dateTo: dateTo || undefined }));
  };
  const showFab = currentTab === 0 && eligibleFilters.scout && eligibleData.items.length > 0;

  return (
    <Stack sx={{ height: '100%', gap: 1 }}>
      <CustomAppBar
        title={STRINGS.payments}
        children={
          <Tabs
            value={currentTab}
            variant="fullWidth"
            onChange={handleTabChange}
            slotProps={{
              indicator: {
                sx: {
                  height: '5%',
                  borderRadius: 10,
                },
              },
            }}
          >
            <Tab label={STRINGS.eligible_payments} />
            <Tab label={STRINGS.payment_history} />
          </Tabs>
        }
      />
      <PaymentFilters
        scout={activeFilters.scout}
        dateFrom={activeFilters.dateFrom}
        dateTo={activeFilters.dateTo}
        onScoutChange={handleScoutChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
      />
      <PaymentTabContent
        hasScout={!!activeFilters.scout}
        isEligibleTab={currentTab === 0}
        eligibleItems={eligibleData.items}
        eligibleTotalCount={eligibleData.totalCount}
        eligibleHasNextPage={eligibleData.hasNextPage}
        eligibleIsFetchingNextPage={eligibleData.isFetchingNextPage}
        onEligibleEndReach={eligibleData.fetchNextPage}
        historyItems={historyData.items}
        historyTotalCount={historyData.totalCount}
        historyHasNextPage={historyData.hasNextPage}
        historyIsFetchingNextPage={historyData.isFetchingNextPage}
        onHistoryEndReach={historyData.fetchNextPage}
      />
      {showFab && (
        <ActionsFab
          actions={[
            {
              label: STRINGS.mark_as_paid,
              icon: <Payment />,
              onClick: handleMarkAsPaid,
            },
          ]}
        />
      )}
      {activeData.isFetching && !activeData.isFetchingNextPage && <LoadingOverlay />}
      {isMarking && <LoadingOverlay />}
    </Stack>
  );
};

export default PaymentsPage;
