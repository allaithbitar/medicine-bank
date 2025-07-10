import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [delayedValue, setDelayedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return delayedValue;
};

export default useDebounce;
