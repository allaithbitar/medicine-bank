import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import STRINGS from '@/core/constants/strings.constant';
import FamilyMemberCard from '@/features/beneficiaries/components/beneficiary-family-members/family-member-card.component';
import { useBeneficiaryFamilyMembersLoader } from '@/features/beneficiaries/hooks/beneficiary-family-members-loader.hook';
import type { TDisclosure } from '@/features/disclosures/types/disclosure.types';
import { Diversity3 } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';

const DisclosureFamilyMembersTab = ({
  disclosure,
  handleOpenFamilyMembersActionPage,
}: {
  disclosure?: TDisclosure;
  handleOpenFamilyMembersActionPage?: (m?: any) => void;
}) => {
  const { items, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, totalCount } =
    useBeneficiaryFamilyMembersLoader({ patientId: disclosure?.patientId ?? '' });
  const isArchived = disclosure?.status === 'archived';

  return (
    <Stack sx={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      <VirtualizedList
        totalCount={totalCount}
        noDataSlot={
          <Nodata
            icon={Diversity3}
            title={STRINGS.no_family_members}
            extra={
              <Button disabled={isArchived} onClick={() => handleOpenFamilyMembersActionPage?.()}>
                {STRINGS.add}
              </Button>
            }
          />
        }
        isLoading={isFetchingNextPage}
        items={items}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
      >
        {({ item }) => (
          <FamilyMemberCard
            member={item}
            onEdit={
              handleOpenFamilyMembersActionPage && !isArchived
                ? () => handleOpenFamilyMembersActionPage?.(item)
                : undefined
            }
          />
        )}
      </VirtualizedList>

      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureFamilyMembersTab;
