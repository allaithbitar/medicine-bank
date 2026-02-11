import { Stack } from '@mui/material';
import DisclosureCard from '../components/disclosure-card.component';
import { Add, SwapHoriz } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useDisclosuresLoader } from '../hooks/disclosures-loader.hook';
import { useCallback, useMemo } from 'react';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import {
  defaultDisclosureFilterValues,
  normalizeStateValuesToDto,
  type TDisclosureFiltersForm,
} from '../helpers/disclosure.helpers';
import useStorage from '@/core/hooks/use-storage.hook';
import { useFileDownload } from '@/core/hooks/use-file-download.hook';
import { notifySuccess, notifyError } from '@/core/components/common/toast/toast';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import { selectUser } from '@/core/slices/auth/auth.slice';
import disclosuresApi from '../api/disclosures.api';

const DisclosuresPage = () => {
  const { openModal, closeModal } = useModal();
  const { currentCanAdd, currentShowFilters, isManagerRole, isSupervisorRole } = usePermissions();
  const { id, name, role } = selectUser();
  const [filtersState, setFiltersState] = useStorage<TDisclosureFiltersForm>('disclosure-filters', {
    ...defaultDisclosureFilterValues,
    scouts: role === 'scout' ? [{ id, name }] : [],
  });

  const queryData = useMemo(() => normalizeStateValuesToDto(filtersState), [filtersState]);

  const navigate = useNavigate();

  const [moveDisclosures, { isLoading: isMoving }] = disclosuresApi.useMoveDisclosuresMutation();

  const { download, isDownloading } = useFileDownload({
    url: '/disclosures/export-excel',
    method: 'PUT',
    filename: `disclosures_${new Date().toISOString().split('T')[0]}.xlsx`,
    onSuccess: () => {
      notifySuccess(STRINGS.download_complete);
      closeModal();
    },
    onError: () => {
      notifySuccess(STRINGS.download_failed);
    },
  });

  const { items, totalCount, error, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useDisclosuresLoader(queryData);

  const handleMoveDisclosures = useCallback(() => {
    openModal({
      name: 'MOVE_DISCLOSURES_MODAL',
      props: {
        onConfirm: async (data) => {
          try {
            await moveDisclosures(data).unwrap();
            notifySuccess(STRINGS.action_done_successfully);
            closeModal();
          } catch (error) {
            notifyError(error);
          }
        },
      },
    });
  }, [moveDisclosures, openModal, closeModal]);

  const handleExportDisclosures = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        title: STRINGS.export_disclosures_confirmation,
        message: STRINGS.export_disclosures_confirmation_description,
        onConfirm: async () => {
          await download(queryData);
        },
      },
    });
  }, [download, queryData, openModal]);

  if (error) {
    return <ErrorCard error={error} />;
  }

  const actions = [];

  if (currentCanAdd) {
    actions.push({
      label: STRINGS.add_disclosure,
      icon: <Add />,
      onClick: () => navigate('/disclosures/action'),
    });
  }

  if (currentShowFilters) {
    actions.push({
      label: STRINGS.filter,
      icon: <FilterListIcon />,
      onClick: () =>
        openModal({
          name: 'DISCLOSURE_FILTERS_MODAL',
          props: {
            onSubmit: (values) => {
              closeModal();
              return setFiltersState(values);
            },
            value: filtersState,
          },
        }),
    });
  }

  if (isManagerRole || isSupervisorRole) {
    actions.push({
      label: STRINGS.move_disclosures,
      icon: <SwapHoriz />,
      onClick: isMoving ? undefined : handleMoveDisclosures,
    });
  }

  actions.push({
    label: STRINGS.export_disclosures,
    icon: <SimCardDownloadIcon />,
    onClick: isDownloading ? undefined : () => handleExportDisclosures(),
  });

  return (
    <Stack sx={{ height: '100%', gap: 1 }}>
      <CustomAppBarComponent title={STRINGS.disclosures} />
      <VirtualizedList
        totalCount={totalCount}
        items={items}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
        isLoading={isFetchingNextPage}
      >
        {({ item: d }) => <DisclosureCard disclosure={d} key={d.id} />}
      </VirtualizedList>
      <ActionsFab actions={actions} />
      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosuresPage;
