import { Button, Card, Stack, Typography } from '@mui/material';
import { CloudDone } from '@mui/icons-material';
import { useEffect, useState } from 'react';
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

const OfflineUpdatesPage = () => {
  const [updateIndex, setUpdateIndex] = useState<number | undefined>(undefined);
  const { data: updates, isFetching } = useLocalUpdatesLoader();
  const { deleteAll } = useLocalUpdatesTable();

  // const { syncUpdate, syncingId } = useSyncUpdate();

  useEffect(() => {
    if (updates) {
      const nextIdx = updates?.findIndex((u) => u.status === 'pending');
      if (nextIdx !== -1) {
        setUpdateIndex(nextIdx);
      } else {
        deleteAll();
      }
    }
  }, [deleteAll, updates]);

  if (isFetching) {
    return <PageLoading />;
  }

  if (!updates || updates.length === 0 || isNullOrUndefined(updateIndex)) {
    return (
      <Card sx={{ p: 1 }}>
        <Header title={STRINGS.offline_updates} />
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
        {/*  <Card
        sx={{
          p: 1,
          width: '100%',
          position: 'fixed',
          bottom: 0,
          zIndex: 2,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Stack direction="row" gap={1}>
          <Button onClick={() => setUpdateIndex((prev) => Math.max(0, prev - 1))}>
            <ArrowForwardIos />
          </Button>

          <Button color="success" fullWidth>
            <Save />
          </Button>

          <Button color="error" fullWidth>
            <DeleteOutline />
          </Button>

          <Button onClick={() => setUpdateIndex((prev) => Math.min(updates.length - 1, prev + 1))}>
            <ArrowBackIos />
          </Button>
        </Stack>
      </Card> */}
        {/*  {data.map((u) => (
        <OfflineUpdate key={u.id} update={u} />
      ))} */}
      </Stack>
    </DisabledOnOffline>
  );
};

export default OfflineUpdatesPage;
