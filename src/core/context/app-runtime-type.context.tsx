import { createContext, useMemo, type ReactNode, type Dispatch, type SetStateAction, useContext } from 'react';
import useStorage from '../hooks/use-storage.hook';

export type TAppRuntimeType = 'offline' | 'online' | 'automatic';
export type TAppRuntimeContext = {
  type: TAppRuntimeType;
  setType: Dispatch<SetStateAction<TAppRuntimeType>>;
};

const AppRuntimeTypeContext = createContext<TAppRuntimeContext>({
  type: 'automatic',
  setType: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAppRuntimeTypeContext = () => useContext(AppRuntimeTypeContext);

export const AppRuntimeTypeContextProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useStorage<TAppRuntimeType>('runtime-type', 'automatic');

  const memoValue = useMemo(() => ({ type, setType }), [type, setType]);

  return <AppRuntimeTypeContext.Provider value={memoValue}>{children}</AppRuntimeTypeContext.Provider>;
};
