import { Card, Stack } from '@mui/material';
import DisclosureCard from '../components/disclosure-card.component';
import { Add, Filter } from '@mui/icons-material';
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
import { notifySuccess } from '@/core/components/common/toast/toast';
import { usePermissions } from '@/core/hooks/use-permissions.hook';
import Header from '@/core/components/common/header/header';

const DisclosuresPage = () => {
  const { openModal, closeModal } = useModal();
  const { currentCanAdd, currentShowFilters } = usePermissions();

  const [filtersState, setFiltersState] = useStorage<TDisclosureFiltersForm>(
    'disclosure-filters',
    defaultDisclosureFilterValues
  );

  const queryData = useMemo(() => normalizeStateValuesToDto(filtersState), [filtersState]);

  const navigate = useNavigate();

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
      icon: <Filter />,
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

  actions.push({
    label: STRINGS.export_disclosures,
    icon: <SimCardDownloadIcon />,
    onClick: isDownloading ? undefined : () => handleExportDisclosures(),
  });

  return (
    <Stack sx={{ height: '100%' }}>
      <Card sx={{ p: 1 }}>
        <Header title={STRINGS.disclosures} />
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
      </Card>
    </Stack>
  );
};

export default DisclosuresPage;
