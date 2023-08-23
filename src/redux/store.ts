import { configureStore } from "@reduxjs/toolkit";
import sideBarReducer from "./features/sidebar-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import formValuesReducer from "./features/formValues-slice";
import countElementsReducer from "./features/countElements-slice";
import queryValuesReducer from "./features/queryValues-slice";

export const store = configureStore({
  reducer: {
    sideBarReducer,
    formValuesReducer,
    countElementsReducer,
    queryValuesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
