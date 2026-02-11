import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import SearchFilter from '@/core/components/common/search-filter/search-filter.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import PriorityDegreesList from '../components/priority-degreesList.component';
import type { TPriorityDegree } from '../types/priority-degree.types';
import { useNavigate } from 'react-router-dom';
import { usePriorityDegreesLoader } from '../hooks/priority-degrees-loader.hook';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';

const PriorityDegreesPage = () => {
  const navigate = useNavigate();
  const { currentCanAdd, currentCanEdit } = usePermissions();

  const [query, setQuery] = useState<string | null>('');

  const { data: priorityDegrees = [], isLoading: isLoadingPriorityDegrees } = usePriorityDegreesLoader({
    name: query ?? undefined,
  });

  const handleOpenPriorityDegreeActionPage = useCallback(
    (oldPriorityDegree?: TPriorityDegree) => {
      if (oldPriorityDegree) {
        navigate(`/priority-degrees/action?id=${oldPriorityDegree.id}`);
      } else {
        navigate(`/priority-degrees/action`);
      }
    },
    [navigate]
  );

  const handleSearch = useCallback((q: string | null) => {
    setQuery(q);
  }, []);

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <CustomAppBarComponent
        title={STRINGS.priority_degrees}
        subtitle={STRINGS.add_manage_priority_degrees}
        children={
          <SearchFilter initialQuery={query} onSearch={handleSearch} placeholder={STRINGS.search_priority_degree} />
        }
      />
      <PriorityDegreesList
        isLoadingPriorityDegrees={isLoadingPriorityDegrees}
        priorityDegrees={priorityDegrees}
        onEdit={currentCanEdit ? handleOpenPriorityDegreeActionPage : undefined}
      />
      {currentCanAdd && (
        <ActionsFab
          actions={[
            {
              label: STRINGS.add,
              icon: <Add />,
              onClick: () => handleOpenPriorityDegreeActionPage(),
            },
          ]}
        />
      )}
      {isLoadingPriorityDegrees && <LoadingOverlay />}
    </Stack>
  );
};

export default PriorityDegreesPage;
