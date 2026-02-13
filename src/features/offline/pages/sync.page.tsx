import { Button, Stack } from '@mui/material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import STRINGS from '@/core/constants/strings.constant';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import { getErrorMessage } from '@/core/helpers/helpers';
import DisabledOnOffline from '@/core/components/common/disabled-on-offline/disabled-on-offline.component';
import { useOfflineSync } from '../hooks/offline-sync.hook';

const SyncPage = () => {
  const { handleSync, isLoading } = useOfflineSync();

  const handleSyncClick = async () => {
    try {
      await handleSync();

      notifySuccess(STRINGS.synced_successfully);
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <DisabledOnOffline>
      <Stack sx={{ height: '100%', position: 'relative' }} justifyContent="center" alignItems="center">
        {isLoading && <LoadingOverlay spinnerSize={100} />}
        <Button disabled={isLoading} onClick={handleSyncClick}>
          {STRINGS.sync}
        </Button>
      </Stack>
    </DisabledOnOffline>
  );
};

export default SyncPage;
