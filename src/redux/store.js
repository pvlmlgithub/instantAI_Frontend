import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage"
import clusterReducer from "./clusterSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["clusterHistory"], // Only persist clusterHistory
}

const persistedReducer = persistReducer(persistConfig, clusterReducer)

export const store = configureStore({
  reducer: {
    cluster: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

