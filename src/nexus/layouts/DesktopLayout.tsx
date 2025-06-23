import React from 'react'
import NexusNavigation from '../components/NexusNavigation'

interface DesktopLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
  showSidebar?: boolean
  fullHeight?: boolean
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  onNewChat,
  showSidebar = true,
  fullHeight = false
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && (
        <NexusNavigation variant="desktop" onNewChat={onNewChat} />
      )}
      
      <main 
        className={`flex-1 ${fullHeight ? 'flex flex-col' : 'overflow-y-auto'}`}
        style={{ marginLeft: showSidebar ? '256px' : '0' }}
      >
        {fullHeight ? (
          children
        ) : (
          <div className="container mx-auto max-w-6xl p-6">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}

export default DesktopLayout