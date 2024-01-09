import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import homeSlice from "~/pages/Home/homeSlice";
import sideBarSlice from "~/layout/Components/SideBar/sideBarSlice";
import headerSlice from "~/layout/Components/Header/headerSlice";
import accountSlice from "~/pages/Account/accountSlice";
import headerFooterSlice from "~/layout/Components/Header/HeaderFooter/headerFooterSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ["account", "header", "chat"]
  }

const rootReducer = combineReducers({
    products: homeSlice.reducer,
    header: headerSlice.reducer,
    sidebar: sideBarSlice.reducer,
    account: accountSlice.reducer,
    headerFooter: headerFooterSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
})

export let persistor = persistStore(store)