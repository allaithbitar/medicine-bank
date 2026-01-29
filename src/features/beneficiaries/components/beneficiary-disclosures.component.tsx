import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import STRINGS from '@/core/constants/strings.constant';
import DisclosureCard from '@/features/disclosures/components/disclosure-card.component';
import { useDisclosuresLoader } from '@/features/disclosures/hooks/disclosures-loader.hook';
import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const BeneficiaryDisclosures = ({ beneficiaryId }: { beneficiaryId?: string }) => {
  const { items, isFetchingNextPage, fetchNextPage, hasNextPage, totalCount, isFetching } = useDisclosuresLoader({
    pageSize: DEFAULT_PAGE_SIZE,
    patientId: beneficiaryId,
  });

  return (
    <Stack sx={{ maxHeight: '90dvh', overflow: 'hidden' }}>
      <VirtualizedList
        noDataSlot={
          <Nodata
            title={STRINGS.beneficiary_doesnt_have_any_disclosure}
            extra={
              <Link to={`/disclosures/action?beneficiaryId=${beneficiaryId}`}>
                <Button>{STRINGS.add}</Button>
              </Link>
            }
          />
        }
        totalCount={totalCount}
        items={items}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
      >
        {({ item: d }) => <DisclosureCard disclosure={d} key={d.id} />}
      </VirtualizedList>
      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default BeneficiaryDisclosures;
