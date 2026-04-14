import { Button, Card, Stack, Typography } from '@mui/material';
import { CloudDone } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useLocalUpdatesLoader } from '../hooks/local-updates-loader.hook';
import NoData from '@/core/components/common/no-data/no-data.component';
import STRINGS from '@/core/constants/strings.constant';
import OfflineUpdate from '../components/offline-update.component';
import PageLoading from '@/core/components/common/page-loading/page-loading.component';
import { isNullOrUndefined } from '@/core/helpers/helpers';
import useLocalUpdatesTable from '../hooks/local-updates-table.hook';
import Header from '@/core/components/common/header/header';
import { Link } from 'react-router-dom';
import DisabledOnOffline from '@/core/components/common/disabled-on-offline/disabled-on-offline.component';
import { useOfflineSync } from '../hooks/offline-sync.hook';
import useBulkOfflineUpdate from '../components/bulk-offline-update.component';

const OfflineUpdatesPage = () => {
  const [updateIndex, setUpdateIndex] = useState<number | undefined>(undefined);
  const { data: updates, isFetching } = useLocalUpdatesLoader();
  const { handleSync, isLoading: isRefreshingLocalDb } = useOfflineSync();
  const { deleteAll } = useLocalUpdatesTable();
  const { handleBulkSaveClick } = useBulkOfflineUpdate();
  console.log(updates);

  // const { syncUpdate, syncingId } = useSyncUpdate();

  const isCleaning = useRef(false);

  useEffect(() => {
    if (isFetching || isCleaning.current) return;
    (async () => {
      if (updates) {
        const nextIdx = updates?.findIndex((u) => u.status === 'pending');
        if (nextIdx !== -1) {
          setUpdateIndex(nextIdx);
        } else {
          isCleaning.current = true;
          await deleteAll();
          try {
            await handleSync();
          } catch (error) {
            console.warn(error);
          } finally {
            isCleaning.current = false;
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteAll, updates]);

  if (isFetching || isRefreshingLocalDb) {
    return <PageLoading />;
  }

  if (!updates || updates.length === 0 || isNullOrUndefined(updateIndex)) {
    return (
      <Card sx={{ p: 1 }}>
        <Header title={STRINGS.offline_updates} showBackButton />
        <NoData
          icon={CloudDone}
          title={STRINGS.all_synced}
          extra={
            <Link to="/">
              <Button>{STRINGS.home_page}</Button>
            </Link>
          }
        />
      </Card>
    );
    return (
      <Stack gap={2}>
        {/* <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {STRINGS.offline_updates}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {STRINGS.no_pending_updates}
          </Typography>
        </Box> */}
      </Stack>
    );
  }

  return (
    <DisabledOnOffline>
      <Stack gap={1} sx={{ height: '100%' }}>
        {updates[updateIndex] && (
          <Card sx={{ flexShrink: 0 }}>
            <Typography color="primary">
              {updateIndex + 1} {STRINGS.out_of} {updates.length} {STRINGS.offline_updates}
            </Typography>
          </Card>
        )}
        {updates && updates[updateIndex] && <OfflineUpdate key={updateIndex} update={updates[updateIndex]} />}
        <Button variant="outlined" onClick={handleBulkSaveClick}>
          Save All
        </Button>
      </Stack>
    </DisabledOnOffline>
  );
};

export default OfflineUpdatesPage;
