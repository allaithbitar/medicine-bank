import { configureStore } from "@reduxjs/toolkit";
import reducer from "./root-reducer";
import { middleware as apiMiddleware } from "../api/root.api";

import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: false,
      // serializableCheck: {
      //   warnAfter: 128,
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      //   ignoredActionPaths: [],
      //   ignoredPaths: [],
      // },
    }).concat(apiMiddleware),
});

export const persistor = persistStore(store);
