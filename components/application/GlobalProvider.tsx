"use client"
import React, { ReactNode, Suspense } from "react";
import { store, persistor } from "@/store/store";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./Loading";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

interface GlobalProviderProps{
  children:ReactNode
}
// Create a client
const queryClient = new QueryClient()

function GlobalProvider({ children }:GlobalProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          { children }
        </PersistGate>
      </Provider>
      <Suspense fallback={null} >
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default GlobalProvider;
