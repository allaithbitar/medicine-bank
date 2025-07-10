import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import authSlice from "./slices/authSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

const reducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: persistReducer(authPersistConfig, authSlice),
});

export default reducer;
