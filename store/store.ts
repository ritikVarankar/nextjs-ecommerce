import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import storageSession from "redux-persist/es/storage";
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./reducer/authReducer";
import cartReducer from "./reducer/cartReducer";

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore:cartReducer
});

const persistConfig = {
  key: "root", // single key in sessionStorage
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
