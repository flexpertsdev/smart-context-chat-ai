import React, { useEffect, useState } from 'react'
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
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize('mobile')
      } else if (width < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  switch (screenSize) {
    case 'mobile':
      return (
        <MobileLayout {...mobileProps}>
          {children}
        </MobileLayout>
      )
    case 'tablet':
      return (
        <TabletLayout onNewChat={onNewChat}>
          {children}
        </TabletLayout>
      )
    case 'desktop':
      return (
        <DesktopLayout onNewChat={onNewChat} {...desktopProps}>
          {children}
        </DesktopLayout>
      )
  }
}

export default AdaptiveLayout