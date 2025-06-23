import React from 'react'
import NexusNavigation from '../components/NexusNavigation'

interface TabletLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
}

const TabletLayout: React.FC<TabletLayoutProps> = ({
  children,
  onNewChat
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <NexusNavigation variant="tablet" onNewChat={onNewChat} />
      
      <main className="flex-1 overflow-y-auto ml-20">
        <div className="container mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}

export default TabletLayout