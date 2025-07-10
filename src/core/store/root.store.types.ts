import { useDispatch } from "react-redux";
import { store } from "./root.store";

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootStoreState = ReturnType<typeof store.getState>;
