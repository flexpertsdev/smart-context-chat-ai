
import React from 'react'
import { motion } from 'framer-motion'
import { Copy, Share, Bookmark, MessageSquare, Trash2 } from 'lucide-react'
import { Message } from '../../types'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'

interface MessageActionsBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedMessages: Message[]
  onCreateContext: () => void
}

const MessageActionsBottomSheet = ({ 
  isOpen, 
  onClose, 
  selectedMessages, 
  onCreateContext 
}: MessageActionsBottomSheetProps) => {
  const actions = [
    {
      icon: MessageSquare,
      label: 'Create Context',
      description: 'Save selected messages as reusable context',
      action: onCreateContext,
      primary: true
    },
    {
      icon: Copy,
      label: 'Copy Messages',
      description: 'Copy messages to clipboard',
      action: () => {
        const text = selectedMessages.map(m => m.content).join('\n\n')
        navigator.clipboard.writeText(text)
        onClose()
      }
    },
    {
      icon: Share,
      label: 'Share',
      description: 'Share selected messages',
      action: () => {
        if (navigator.share) {
          const text = selectedMessages.map(m => m.content).join('\n\n')
          navigator.share({ text })
        }
        onClose()
      }
    },
    {
      icon: Bookmark,
      label: 'Bookmark',
      description: 'Save messages for later',
      action: () => {
        // TODO: Implement bookmarking
        onClose()
      }
    }
  ]

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Actions for {selectedMessages.length} message{selectedMessages.length !== 1 ? 's' : ''}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-2">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                action.primary
                  ? 'bg-green-50 border-green-200 hover:bg-green-100'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center space-x-3">
                <action.icon className={`w-5 h-5 ${
                  action.primary ? 'text-green-600' : 'text-gray-600'
                }`} />
                <div>
                  <div className={`font-medium ${
                    action.primary ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {action.label}
                  </div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MessageActionsBottomSheet
