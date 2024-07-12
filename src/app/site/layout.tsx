import React from 'react'

import Navigation from '@/components/site/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { currentUser, User } from '@clerk/nextjs/server'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const authUser = await currentUser();
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-full">
        <Navigation user={authUser} />
        {children}
      </main>
    </ClerkProvider>
  )
}

export default layout