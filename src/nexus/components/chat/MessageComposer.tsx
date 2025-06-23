import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Mic, X, Image, FileText, Smile } from 'lucide-react'
import Button from '../../foundations/Button'

interface MessageComposerProps {
  onSendMessage: (message: string, attachments?: File[]) => void
  onStartRecording?: () => void
  onStopRecording?: () => void
  isRecording?: boolean
  placeholder?: string
  maxLength?: number
  showAttachments?: boolean
  showEmoji?: boolean
  disabled?: boolean
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  onStartRecording,
  onStopRecording,
  isRecording = false,
  placeholder = 'Type a message...',
  maxLength = 1000,
  showAttachments = true,
  showEmoji = true,
  disabled = false
}) => {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments)
      setMessage('')
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
    setShowAttachmentMenu(false)
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 flex flex-wrap gap-2"
          >
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
              >
                {getFileIcon(file)}
                <span className="text-sm text-gray-700 max-w-[150px] truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="hover:bg-gray-200 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div className="flex items-end gap-2">
        {showAttachments && (
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={disabled}
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <AnimatePresence>
              {showAttachmentMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Document</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                  >
                    <Image className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-gray-100 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
          />
          {showEmoji && (
            <button
              className="absolute right-2 bottom-2 p-1 hover:bg-gray-200 rounded transition-colors"
              disabled={disabled}
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {isRecording ? (
          <Button
            onClick={onStopRecording}
            variant="danger"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
          >
            <div className="w-3 h-3 bg-white rounded-sm" />
          </Button>
        ) : message.trim() || attachments.length > 0 ? (
          <Button
            onClick={handleSend}
            variant="primary"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
            disabled={disabled}
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={onStartRecording}
            variant="ghost"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
            disabled={disabled || !onStartRecording}
          >
            <Mic className="w-5 h-5" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default MessageComposer