'use client'
import React, { PropsWithChildren } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const Queryclient = ({children}:PropsWithChildren) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    });

  // You can use the queryClient here or pass it down to other components
  // For example, you might want to wrap your application with a QueryClientProvider
  return (
     <QueryClientProvider client={queryClient}>
        {children}
     </QueryClientProvider>
  )
}

export default Queryclient
