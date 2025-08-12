import { useEffect, useState } from "react";

const useIsOffline = () => {
  const [isOffline, setIsOffline] = useState(() => !window.navigator.onLine);
  useEffect(() => {
    function onOnlineHandler() {
      setIsOffline(false);
    }
    function onOfflineHandler() {
      setIsOffline(true);
    }

    window.addEventListener("online", onOnlineHandler);
    window.addEventListener("offline", onOfflineHandler);
    return () => {
      window.removeEventListener("online", onOnlineHandler);
      window.removeEventListener("offline", onOfflineHandler);
    };
  }, []);
  return isOffline;
};
export default useIsOffline;
