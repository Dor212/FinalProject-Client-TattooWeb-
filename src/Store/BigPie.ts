import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import BusinessSlice from "./BusinessSlice";

const store = configureStore({
    reducer : {UserSlice, BusinessSlice},
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});
const rootReducer = combineReducers({UserSlice, BusinessSlice});
export type TRootState = ReturnType <typeof rootReducer>;
export default store;