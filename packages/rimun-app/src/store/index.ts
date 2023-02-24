import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createLogger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { STORE_VERSION } from "src/config";
import rootReducer from "./reducers";

const persistConfig = {
  key: `rimun:root_${STORE_VERSION}`,
  storage,
  whitelist: ["auth", "device"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [createLogger()],
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useStateDispatch: () => AppDispatch = useDispatch;
export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
