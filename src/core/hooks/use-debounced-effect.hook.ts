import { useEffect, useRef } from "react";
import { isNullOrUndefined } from "../helpers/helpers";

const useDebouncedEffect = ({
  func,
  cleanup,
  delay = 200,
  deps,
}: {
  func: () => void | Promise<void>;
  cleanup?: () => void;
  delay?: number;
  deps: any[];
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current as any);

    timeoutRef.current = setTimeout(
      async () => {
        await func();
      },
      isNullOrUndefined(delay) ? 200 : delay,
    );
    return () => {
      clearTimeout(timeoutRef.current as any);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useDebouncedEffect;
