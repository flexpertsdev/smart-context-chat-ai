
import React from 'react'
import { motion } from 'framer-motion'
import { Trash2, X } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'

interface DeleteConfirmationSheetProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  chatTitle: string
}

const DeleteConfirmationSheet = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  chatTitle 
}: DeleteConfirmationSheetProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[40vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span>Delete Chat</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-900 font-medium mb-2">
              Delete "{chatTitle}"?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone. All messages in this chat will be permanently deleted.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Forever</span>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DeleteConfirmationSheet
