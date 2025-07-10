import type { IAuthState, IUser } from "@/features/auth/types/auth.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: IAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: IUser;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: () => ({ ...initialState }),
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: IAuthState }) =>
  state.auth.user as IUser;
export const selectCurrentToken = (state: { auth: IAuthState }) =>
  state.auth.token;
