import { useReducer } from "react";

type Updater<T> = Partial<T> | ((curr: T) => Partial<T>);

function useReducerState<T>(
  initialState: T,
  initFun?: (arg: T) => T
): [T, (update: Updater<T>) => void] {
  const [state, dispatch] = useReducer(
    (curr: T, update: Updater<T>): T => ({
      ...curr,
      ...(typeof update === "function" ? update(curr) : update),
    }),
    initialState,
    initFun as (arg: T) => T
  );

  return [state, dispatch];
}

export default useReducerState;
