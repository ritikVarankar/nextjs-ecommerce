import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthDataType {
  _id: string;
  role: string;
  name: string;
  avatar: {
    url:string;
  }
}

interface IntialStateDataType {
  status: "idle" | "loading" | "success" | "failed";
  auth: AuthDataType | null;
  error: string | null;
}

const initialState: IntialStateDataType = {
  status: "idle",
  auth: null,
  error: null,
};

export const authReducer = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthDataType>) => {
      state.auth = action.payload;
      state.status = "success";
      state.error = null;
    },
    logout: (state) => {
      state.auth = null;
      state.status = "idle";
      state.error = null;
    }
  },
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;
