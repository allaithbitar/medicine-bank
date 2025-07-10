import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: () => ({ ...initialState }),
  },
});

export const { setUserCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user as User;
export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
