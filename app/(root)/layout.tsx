import { Navbar } from '@/components/Navbar'
import React, { PropsWithChildren } from 'react'

const RootGroupRoutelayout = ({children}:PropsWithChildren) => {
  return (
    <main className='w-full flex flex-1 min-h-screen flex-col'>
        <Navbar />
        {children}
    </main>
  )
}

export default RootGroupRoutelayout
