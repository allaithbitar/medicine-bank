import { memo } from 'react';
import { Person } from '@mui/icons-material';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import Nodata from '@/core/components/common/no-data/no-data.component';
import STRINGS from '@/core/constants/strings.constant';
import EligiblePaymentCard from './eligible-payment-card.component';
import HistoryPaymentCard from './history-payment-card.component';
import type { TPaymentEligibleItem, TPaymentHistoryItem } from '../types/payment.types';

interface IPaymentTabContentProps {
  hasScout: boolean;
  isEligibleTab: boolean;
  eligibleItems: TPaymentEligibleItem[];
  eligibleTotalCount: number;
  eligibleHasNextPage: boolean;
  eligibleIsFetchingNextPage: boolean;
  onEligibleEndReach?: () => void;
  historyItems: TPaymentHistoryItem[];
  historyTotalCount: number;
  historyHasNextPage: boolean;
  historyIsFetchingNextPage: boolean;
  onHistoryEndReach?: () => void;
}
const PaymentTabContent = ({
  hasScout,
  isEligibleTab,
  eligibleItems,
  eligibleTotalCount,
  eligibleHasNextPage,
  eligibleIsFetchingNextPage,
  onEligibleEndReach,
  historyItems,
  historyTotalCount,
  historyHasNextPage,
  historyIsFetchingNextPage,
  onHistoryEndReach,
}: IPaymentTabContentProps) => {
  if (!hasScout) {
    return <Nodata title={STRINGS.no_scout_selected} icon={Person} />;
  }
  if (isEligibleTab) {
    return (
      <VirtualizedList
        items={eligibleItems}
        totalCount={eligibleTotalCount}
        onEndReach={eligibleHasNextPage && !eligibleIsFetchingNextPage ? onEligibleEndReach : undefined}
        isLoading={eligibleIsFetchingNextPage}
        emptyMessage={STRINGS.no_eligible_payments}
      >
        {({ item }) => <EligiblePaymentCard item={item} key={item.disclosureId} />}
      </VirtualizedList>
    );
  }
  return (
    <VirtualizedList
      items={historyItems}
      totalCount={historyTotalCount}
      onEndReach={historyHasNextPage && !historyIsFetchingNextPage ? onHistoryEndReach : undefined}
      isLoading={historyIsFetchingNextPage}
      emptyMessage={STRINGS.no_payment_history}
    >
      {({ item }) => <HistoryPaymentCard item={item} key={item.disclosureId} />}
    </VirtualizedList>
  );
};

export default memo(PaymentTabContent);
