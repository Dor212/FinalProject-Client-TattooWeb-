import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice.ts";
import AdminSlice from "./AdminSlice.ts";

const rootReducer = combineReducers({
  UserSlice,
  AdminSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type TRootState = ReturnType<typeof rootReducer>;
export default store;
