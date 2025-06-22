import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Camera, Image, FileText, Link, X } from 'lucide-react'
import AttachmentModal from './AttachmentModal'
import VoiceRecorder from './VoiceRecorder'

interface Attachment {
  id: string
  type: 'image' | 'document' | 'link' | 'audio'
  file?: File
  url?: string
  title?: string
  preview?: string
}

interface MessageComposerProps {
  onSendMessage: (message: string, attachments?: Attachment[]) => void
}

const MessageComposer = ({ onSendMessage }: MessageComposerProps) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const LINE_HEIGHT = 24 // 1.5rem in pixels
  const MIN_HEIGHT = 48 // Minimum height for single line
  const MAX_LINES = 5
  const MAX_HEIGHT = MIN_HEIGHT + (LINE_HEIGHT * (MAX_LINES - 1))

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT)
      textarea.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments.length > 0 ? attachments : undefined)
      setMessage('')
      setAttachments([])
      setShowAttachments(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' && e.shiftKey) || (e.key === 'Enter' && e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleFileSelect = (files: FileList | null, type: 'image' | 'document') => {
    if (!files) return

    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: Date.now() + Math.random().toString(),
        type,
        file,
        title: file.name
      }

      if (type === 'image') {
        const reader = new FileReader()
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string
          setAttachments(prev => [...prev, attachment])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachments(prev => [...prev, attachment])
      }
    })
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleGallerySelect = () => {
    fileInputRef.current?.click()
  }

  const handleDocumentSelect = () => {
    documentInputRef.current?.click()
  }

  const handleLinkAdd = (url: string, title?: string) => {
    const attachment: Attachment = {
      id: Date.now().toString(),
      type: 'link',
      url,
      title: title || url
    }
    setAttachments(prev => [...prev, attachment])
  }

  const handleVoiceRecording = (audioBlob: Blob) => {
    const attachment: Attachment = {
      id: Date.now().toString(),
      type: 'audio',
      file: new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' }),
      title: 'Voice Message'
    }
    setAttachments(prev => [...prev, attachment])
    setIsRecording(false)
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const attachmentOptions = [
    {
      icon: Camera,
      label: 'Camera',
      color: 'bg-blue-500',
      action: handleCameraCapture
    },
    {
      icon: Image,
      label: 'Gallery',
      color: 'bg-purple-500',
      action: handleGallerySelect
    },
    {
      icon: FileText,
      label: 'Document',
      color: 'bg-green-500',
      action: handleDocumentSelect
    },
    {
      icon: Link,
      label: 'Link',
      color: 'bg-orange-500',
      action: () => setShowLinkModal(true)
    }
  ]

  return (
    <div className="bg-white border-t border-gray-200 p-3 safe-area-bottom safe-area-left safe-area-right">
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <motion.div
                    key={attachment.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-white rounded-lg p-2 border border-gray-200 max-w-xs"
                  >
                    <div className="flex items-center space-x-2">
                      {attachment.type === 'image' && attachment.preview && (
                        <img
                          src={attachment.preview}
                          alt={attachment.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      {attachment.type === 'document' && (
                        <FileText className="w-6 h-6 text-green-500" />
                      )}
                      {attachment.type === 'link' && (
                        <Link className="w-6 h-6 text-orange-500" />
                      )}
                      {attachment.type === 'audio' && (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-700 truncate">
                        {attachment.title}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recording - Only show when recording */}
      {isRecording && (
        <VoiceRecorder
          isRecording={isRecording}
          onStartRecording={() => setIsRecording(true)}
          onStopRecording={() => setIsRecording(false)}
          onSendRecording={handleVoiceRecording}
          onCancelRecording={() => setIsRecording(false)}
        />
      )}

      {/* Attachment Options */}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="grid grid-cols-4 gap-3">
                {attachmentOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={option.action}
                    className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end space-x-2">
        {/* Attachment Button */}
        <motion.button
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${
            showAttachments 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAttachments ? (
            <X className="w-5 h-5" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </motion.button>

        {/* Message Input Container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base leading-6 overflow-y-auto scrollbar-hidden"
            style={{ 
              minHeight: `${MIN_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
              lineHeight: `${LINE_HEIGHT}px`
            }}
            rows={1}
          />
          {/* Hint text for keyboard shortcuts */}
          {message.trim() && (
            <div className="absolute -top-6 left-2 text-xs text-gray-400">
              Shift+Enter to send
            </div>
          )}
        </div>

        {/* Send Button or Voice Recorder */}
        {(message.trim() || attachments.length > 0) ? (
          <motion.button
            onClick={handleSend}
            className="p-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        ) : (
          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={() => setIsRecording(false)}
            onSendRecording={handleVoiceRecording}
            onCancelRecording={() => setIsRecording(false)}
          />
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'image')}
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'image')}
      />
      
      <input
        ref={documentInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.rtf"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'document')}
      />

      {/* Link Modal */}
      <AttachmentModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkAdd}
      />
    </div>
  )
}

export default MessageComposer
