import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { indexApi } from "./api/index.api";
import authSlice from "./slices/auth.slice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

const reducer = combineReducers({
  [indexApi.reducerPath]: indexApi.reducer,
  auth: persistReducer(authPersistConfig, authSlice),
});

export default reducer;
