import { useEffect, useRef, useState } from "react";

function useStorage<T>(
  key: string,
  initialState?: T | null,
  storage: Storage = sessionStorage,
) {
  const [data, setData] = useState<T>(() => {
    const savedData = storage.getItem(key);

    return (
      (savedData && savedData !== "undefined" && JSON.parse(savedData)) ||
      initialState
    );
  });
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (key) {
      storage.setItem(key, JSON.stringify(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, key]);

  return [data, setData] as const;
}

export default useStorage;
