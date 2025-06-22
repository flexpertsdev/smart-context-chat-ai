import React, { useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, MoreVertical, Hash, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContextStore } from '../../stores/contextStore'
import { useNavigationService, navigationService } from '../../services/navigationService'

interface HeaderProps {
  onAddContext?: () => void
  onShowContextPanel?: () => void
}

const Header = ({ onAddContext, onShowContextPanel }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { chatId } = useParams()
  const { activeContexts, getContextsByIds } = useContextStore()
  const { goBack, canGoBack, navigateTo } = useNavigationService()
  
  // Initialize navigation service with navigate function
  useEffect(() => {
    navigationService.initialize(navigate)
  }, [navigate])
  
  const showBackButton = location.pathname !== '/' && canGoBack()
  const isChat = location.pathname.startsWith('/chat/')
  const attachedContexts = chatId ? getContextsByIds(activeContexts[chatId] || []) : []
  
  const getTitle = () => {
    const path = location.pathname
    
    // Dynamic title based on route
    if (path === '/') return (
      <span>
        <span className="text-green-600">What</span>sFLEX
      </span>
    )
    if (path === '/contexts') return 'Context Library'
    if (path === '/contexts/new') return 'Create Context'
    if (path === '/tag-management') return 'Tag Management'
    if (path === '/settings') return 'Settings'
    if (path === '/settings/tags') return 'Manage Tags'
    if (path.startsWith('/chat/')) return (
      <span>
        <span className="text-green-600">What</span>sFLEX
      </span>
    )
    if (path.startsWith('/contexts/') && path !== '/contexts/new') return 'Context Details'
    
    return (
      <span>
        <span className="text-green-600">What</span>sFLEX
      </span>
    )
  }

  const getSubtitle = () => {
    if (isChat && attachedContexts.length > 0) {
      return `${attachedContexts.length} context${attachedContexts.length !== 1 ? 's' : ''} active`
    }
    return null
  }

  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between safe-area-top safe-area-left safe-area-right"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3 flex-1">
        {showBackButton && (
          <motion.button
            onClick={goBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
        
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {getTitle()}
          </h1>
          {getSubtitle() && (
            <p className="text-xs text-green-600">
              {getSubtitle()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isChat && onAddContext && (
          <motion.button
            onClick={onAddContext}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Add context"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}

        <motion.button
          onClick={() => navigateTo('/settings/tags')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Manage tags"
        >
          <Hash className="w-5 h-5 text-gray-600" />
        </motion.button>
        
        {isChat && onShowContextPanel && (
          <motion.button
            onClick={onShowContextPanel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Show context panel"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
        
        {!isChat && (
          <motion.button
            onClick={() => navigateTo('/settings')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Settings"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
      </div>
    </motion.header>
  )
}

export default Header
