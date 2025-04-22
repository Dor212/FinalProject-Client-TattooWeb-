import { TRootState } from "./BigPie.ts";

export const selectUser = (state: TRootState) => state.UserSlice.user;
export const selectIsAdmin = (state: TRootState) => state.UserSlice.user?.isAdmin === true;
