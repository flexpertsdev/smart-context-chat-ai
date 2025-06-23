import React from 'react'
import { ArrowLeft, Search, MoreVertical, Camera, Phone, Video } from 'lucide-react'
import { motion } from 'framer-motion'

interface MobileHeaderProps {
  title?: string
  subtitle?: string
  onBack?: () => void
  variant?: 'home' | 'chat' | 'settings'
  actions?: Array<{
    icon: React.ElementType
    onClick: () => void
    label: string
  }>
  profileImage?: string
  isOnline?: boolean
  searchMode?: boolean
  onSearchToggle?: () => void
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'WhatsApp',
  subtitle,
  onBack,
  variant = 'home',
  actions = [],
  profileImage,
  isOnline,
  searchMode = false,
  onSearchToggle
}) => {
  // Default actions based on variant
  const defaultActions = {
    home: [
      { icon: Camera, onClick: () => {}, label: 'Camera' },
      { icon: Search, onClick: onSearchToggle || (() => {}), label: 'Search' },
      { icon: MoreVertical, onClick: () => {}, label: 'Menu' }
    ],
    chat: [
      { icon: Video, onClick: () => {}, label: 'Video call' },
      { icon: Phone, onClick: () => {}, label: 'Voice call' },
      { icon: MoreVertical, onClick: () => {}, label: 'Menu' }
    ],
    settings: []
  }

  const displayActions = actions.length > 0 ? actions : defaultActions[variant]

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white safe-area-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center flex-1 min-w-0">
          {onBack && (
            <motion.button
              onClick={onBack}
              className="p-2 -ml-2 mr-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          )}

          {/* Profile Image for Chat */}
          {variant === 'chat' && profileImage && (
            <div className="relative mr-3">
              <img 
                src={profileImage} 
                alt={title} 
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-green-600 rounded-full" />
              )}
            </div>
          )}

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium truncate">
              {searchMode && variant === 'home' ? (
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent outline-none placeholder-white/70"
                  autoFocus
                />
              ) : (
                title
              )}
            </h1>
            {subtitle && !searchMode && (
              <p className="text-sm text-white/80 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {displayActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={index}
                onClick={action.onClick}
                className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label={action.label}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Search Bar for Home (WhatsApp style) */}
      {variant === 'home' && !searchMode && (
        <div className="px-4 pb-3">
          <button
            onClick={onSearchToggle}
            className="w-full bg-white/20 hover:bg-white/25 rounded-full px-4 py-2 flex items-center gap-3 transition-colors"
          >
            <Search className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-sm">Search</span>
          </button>
        </div>
      )}
    </motion.header>
  )
}

export default MobileHeader