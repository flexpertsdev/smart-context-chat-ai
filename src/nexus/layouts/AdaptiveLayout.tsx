import React from 'react'
import MobileLayout from './MobileLayout'
import TabletLayout from './TabletLayout'
import DesktopLayout from './DesktopLayout'

interface AdaptiveLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
  mobileProps?: {
    showHeader?: boolean
    showBottomNav?: boolean
    headerTitle?: string
    onBack?: () => void
    fullHeight?: boolean
  }
  desktopProps?: {
    showSidebar?: boolean
    fullHeight?: boolean
  }
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  onNewChat,
  mobileProps = {},
  desktopProps = {}
}) => {
  return (
    <>
      {/* Mobile Layout - shown only on mobile devices */}
      <div className="md:hidden h-dvh">
        <MobileLayout {...mobileProps}>
          {children}
        </MobileLayout>
      </div>
      
      {/* Tablet Layout - shown only on tablets */}
      <div className="hidden md:block lg:hidden h-dvh">
        <TabletLayout onNewChat={onNewChat}>
          {children}
        </TabletLayout>
      </div>
      
      {/* Desktop Layout - shown only on desktop */}
      <div className="hidden lg:block h-dvh">
        <DesktopLayout onNewChat={onNewChat} {...desktopProps}>
          {children}
        </DesktopLayout>
      </div>
    </>
  )
}

export default AdaptiveLayout