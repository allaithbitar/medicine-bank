import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import SearchFilter from '@/core/components/common/search-filter/search-filter.component';
import { useCallback, useState } from 'react';
import type { TMedicine } from '../../types/medicines.types';
import { useNavigate } from 'react-router-dom';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import { useMedicinesLoader } from '../../hooks/medicines/medicines-loader.hook';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import MedicineCard from '../../components/medicines/medicine-card/medicine-card.component';
import { usePermissions } from '@/core/hooks/use-permissions.hook';

const MedicinesPage = () => {
  const [query, setQuery] = useState<string | null>('');
  const navigate = useNavigate();
  const { currentCanAdd, currentCanEdit } = usePermissions();

  const { items, totalCount, isFetching, isFetchingNextPage } = useMedicinesLoader({ name: query });

  const handleOpenMedicineModal = (oldMedicine?: TMedicine) => {
    if (oldMedicine) {
      navigate(`/medicines/action?id=${oldMedicine.id}`);
    } else {
      navigate('/medicines/action');
    }
  };

  const handleSearch = useCallback((q: string | null) => {
    setQuery(q);
  }, []);

  return (
    <Stack gap={1} sx={{ height: '100%' }}>
      <CustomAppBarComponent
        title={STRINGS.medicines_management}
        subtitle={STRINGS.add_manage_medicines}
        children={<SearchFilter initialQuery={query} onSearch={handleSearch} placeholder={STRINGS.search_med} />}
      />
      <VirtualizedList
        emptyMessage={STRINGS.no_medicines_found}
        totalCount={totalCount}
        isLoading={isFetchingNextPage}
        items={items}
      >
        {({ item: med }) => {
          return <MedicineCard onEdit={currentCanEdit ? handleOpenMedicineModal : undefined} medicine={med} />;
        }}
      </VirtualizedList>

      {currentCanAdd && (
        <ActionsFab
          actions={[
            {
              label: STRINGS.add,
              icon: <Add />,
              onClick: () => handleOpenMedicineModal(),
            },
          ]}
        />
      )}

      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default MedicinesPage;
