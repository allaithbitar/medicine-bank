// import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import STRINGS from '@/core/constants/strings.constant';
import { Add } from '@mui/icons-material';
import { Card, Stack } from '@mui/material';
import EmployeeCard from '../components/employee-card.component';
import { useNavigate } from 'react-router-dom';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import { useEmployeesLoader } from '../hooks/employees-loader.hook';
import { useState } from 'react';
import type { TSearchEmployeesDto } from '../types/employee.types';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import useUser from '@/core/hooks/user-user.hook';
import Header from '@/core/components/common/header/header';

const defaultState = {
  pageSize: DEFAULT_PAGE_SIZE,
  pageNumber: DEFAULT_PAGE_NUMBER,
};

const EmployeesPage = () => {
  const navigate = useNavigate();
  const { name } = useUser();
  const { currentCanAdd, currentCanEdit, currentUserRole } = usePermissions();

  const [queryData] = useState<TSearchEmployeesDto>({
    ...defaultState,
    ...(currentUserRole === 'scout' && { query: name }),
  });

  const { items, error, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useEmployeesLoader(queryData);

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <Card sx={{ p: 1 }}>
        <Header title={currentUserRole === 'scout' ? STRINGS.employee : STRINGS.employees} />
        <VirtualizedList
          items={items}
          onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
          isLoading={isFetchingNextPage}
        >
          {({ item: e }) => <EmployeeCard canEdit={currentCanEdit} employee={e} key={e.id} />}
        </VirtualizedList>
        {currentCanAdd && (
          <ActionsFab
            actions={[
              {
                label: STRINGS.add_employee,
                icon: <Add />,
                onClick: () => navigate('/employees/action'),
              },
            ]}
          />
        )}
        {isLoading && <LoadingOverlay />}
      </Card>
    </Stack>
  );
};

export default EmployeesPage;
