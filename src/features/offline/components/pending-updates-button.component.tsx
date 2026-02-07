import { CloudUpload } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocalUpdatesCountLoader } from '../hooks/local-updates-loader.hook';
import { isNullOrUndefined } from '@/core/helpers/helpers';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

const PendingUpdatesButton = () => {
  const { data: count } = useLocalUpdatesCountLoader();
  const isOffline = useIsOffline();
  if (isNullOrUndefined(count) || count === 0 || isOffline) return null;
  return (
    <Link to="/offline-updates">
      <IconButton>
        <CloudUpload color="warning" />
      </IconButton>
    </Link>
  );
};

export default PendingUpdatesButton;
