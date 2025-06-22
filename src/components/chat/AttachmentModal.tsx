
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Link as LinkIcon } from 'lucide-react'

interface AttachmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string, title?: string) => void
}

const AttachmentModal = ({ isOpen, onClose, onSubmit }: AttachmentModalProps) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim(), title.trim() || undefined)
      setUrl('')
      setTitle('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Add Link</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Link
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AttachmentModal
