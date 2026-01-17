import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import priorityDegreesApi from '../api/priority-degrees.api';
import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import SearchFilter from '@/core/components/common/search-filter/search-filter.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import PriorityDegreesList from '../components/priority-degreesList.component';
import type { TPriorityDegree } from '../types/priority-degree.types';
import { useNavigate } from 'react-router-dom';

const PriorityDegreesPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState<string | null>('');

  const { data: priorityDegrees = [], isLoading: isLoadingPriorityDegrees } =
    priorityDegreesApi.useGetPriorityDegreesQuery({ name: query ?? undefined });

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
        onEdit={handleOpenPriorityDegreeActionPage}
      />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenPriorityDegreeActionPage(),
          },
        ]}
      />
    </Stack>
  );
};

export default PriorityDegreesPage;
