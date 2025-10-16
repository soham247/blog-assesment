import Navigation from '@/components/navigation'
import React from 'react'

function layout({children} : {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-background">
    <Navigation />
    {children}
    </div>
  )
}

export default layout