import { useEffect, useState } from 'react';
import { useAppRuntimeTypeContext } from '../context/app-runtime-type.context';

const useIsOffline = () => {
  const { type } = useAppRuntimeTypeContext();
  const [isOffline, setIsOffline] = useState(() => !window.navigator.onLine);
  useEffect(() => {
    function onOnlineHandler() {
      setIsOffline(false);
    }
    function onOfflineHandler() {
      setIsOffline(true);
    }

    window.addEventListener('online', onOnlineHandler);
    window.addEventListener('offline', onOfflineHandler);
    return () => {
      window.removeEventListener('online', onOnlineHandler);
      window.removeEventListener('offline', onOfflineHandler);
    };
  }, []);

  if (type === 'online') {
    return false;
  }
  if (type === 'offline') {
    return true;
  }

  return isOffline;
};
export default useIsOffline;
