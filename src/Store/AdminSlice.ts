import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "../Types/TUser.ts";

const initialState = {
  isAdmin: false,
  user: null as TUser | null
};

const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state: TAdminState, action: PayloadAction<TUser>) => {
      state.isAdmin = true;
      state.user = action.payload;
    },
    clearAdmin: (state: TAdminState) => {
      state.isAdmin = false;
      state.user = null;
    }
  },
});

export const adminActions = AdminSlice.actions;
export default AdminSlice.reducer;
export type TAdminState = typeof initialState;
