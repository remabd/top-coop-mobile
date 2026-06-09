import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
});

export type AppStore = typeof store;
export type typeRootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
