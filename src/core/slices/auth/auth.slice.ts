/* eslint-disable react-hooks/rules-of-hooks */
import type { RootStoreState } from "@/core/store/root.store.types";
import type { TLogin } from "@/features/auth/types/auth.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState: TLogin = {
  areaId: null,
  createdAt: "",
  id: "",
  name: "",
  phone: "",
  refreshToken: "",
  role: "scout",
  token: "",
  updatedAt: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TLogin>) => ({
      ...state,
      ...action.payload,
    }),
    logoutUser: () => ({ ...initialState }),
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

export const selectUser = () =>
  useSelector((state: RootStoreState) => state.auth);

export const selectToken = () =>
  useSelector((state: RootStoreState) => state.auth.token);
