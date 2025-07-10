import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { rootApi } from "../api/root.api";
import authSlice from "../slices/auth/auth.slice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

const reducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  auth: persistReducer(authPersistConfig, authSlice),
});

export default reducer;
