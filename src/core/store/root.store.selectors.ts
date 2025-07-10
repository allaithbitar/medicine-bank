import { store } from "./root.store";

const getState = () => store.getState();

const getDispatch = () => store.dispatch;

export const rootStoreSelectors = { getState, getDispatch };
