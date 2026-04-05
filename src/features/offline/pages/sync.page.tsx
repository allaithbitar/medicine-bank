import { Button, Card, Stack, Typography } from '@mui/material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import STRINGS from '@/core/constants/strings.constant';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import { getErrorMessage } from '@/core/helpers/helpers';
import DisabledOnOffline from '@/core/components/common/disabled-on-offline/disabled-on-offline.component';
import { useOfflineSync } from '../hooks/offline-sync.hook';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalUpdatesCountLoader } from '../hooks/local-updates-loader.hook';
import { Sync } from '@mui/icons-material';

const SyncPage = () => {
  const navigate = useNavigate();
  const { handleSync, isLoading } = useOfflineSync();
  const { data: localUpdatesCount } = useLocalUpdatesCountLoader();

  const handleSyncClick = async () => {
    try {
      await handleSync();
      navigate('/');
      notifySuccess(STRINGS.synced_successfully);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <DisabledOnOffline>
      <Stack sx={{ position: 'relative', height: '100%' }} justifyContent="center">
        <Card>
          <Stack alignItems="center" gap={2}>
            {isLoading && <LoadingOverlay spinnerSize={100} />}
            <Sync color="primary" sx={{ fontSize: 100 }} />
            {!!localUpdatesCount && (
              <>
                <Typography textAlign="center" color="error">
                  {STRINGS.sync_warning}
                </Typography>
                <Link to="/offline-updates">
                  <Button variant="outlined">
                    <Typography variant="body2">{STRINGS.go_to_unsaved_changes}</Typography>
                  </Button>
                </Link>
              </>
            )}
            <Button disabled={isLoading} onClick={handleSyncClick}>
              {STRINGS.sync}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </DisabledOnOffline>
  );
};

export default SyncPage;
