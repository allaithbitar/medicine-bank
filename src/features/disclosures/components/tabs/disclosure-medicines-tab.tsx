import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import STRINGS from '@/core/constants/strings.constant';
import BeneficiaryMedicineCard from '@/features/beneficiaries/components/beneficiary-medicines/beneficiary-medicine-card.component';
import { useBeneficiaryMedicinesLoader } from '@/features/beneficiaries/hooks/beneficiary-medicines-loader.hook';
import type { TDisclosure } from '@/features/disclosures/types/disclosure.types';
import { MedicalServices } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';

const DisclosureMedicinesTab = ({
  disclosure,
  handleOpenBeneficiaryMedicineActionPage,
}: {
  disclosure?: TDisclosure;
  handleOpenBeneficiaryMedicineActionPage?: (bm?: any) => void;
}) => {
  const { items, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, totalCount } =
    useBeneficiaryMedicinesLoader({
      patientId: disclosure?.patientId ?? '',
    });
  return (
    <Stack sx={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      <VirtualizedList
        totalCount={totalCount}
        noDataSlot={
          <Nodata
            icon={MedicalServices}
            title={STRINGS.no_medicines_found}
            extra={<Button onClick={() => handleOpenBeneficiaryMedicineActionPage?.()}>{STRINGS.add}</Button>}
          />
        }
        isLoading={isFetchingNextPage}
        items={items}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
      >
        {({ item }) => {
          return <BeneficiaryMedicineCard item={item} onEdit={() => handleOpenBeneficiaryMedicineActionPage?.(item)} />;
        }}
      </VirtualizedList>

      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureMedicinesTab;
