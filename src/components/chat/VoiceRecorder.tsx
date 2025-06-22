
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react'

interface VoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onSendRecording: (audioBlob: Blob) => void
  onCancelRecording: () => void
}

const VoiceRecorder = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSendRecording,
  onCancelRecording
}: VoiceRecorderProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording) {
      startTimer()
    } else {
      stopTimer()
    }

    return () => stopTimer()
  }, [isRecording])

  const startTimer = () => {
    setDuration(0)
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      onStartRecording()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      onStopRecording()
    }
  }

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      setIsPlaying(true)
      
      audioRef.current.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  const pauseRecording = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const sendRecording = () => {
    if (audioBlob) {
      onSendRecording(audioBlob)
      setAudioBlob(null)
      setDuration(0)
    }
  }

  const cancelRecording = () => {
    setAudioBlob(null)
    setDuration(0)
    onCancelRecording()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (audioBlob) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={isPlaying ? pauseRecording : playRecording}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <span className="text-sm font-medium text-gray-700">
              {formatDuration(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={cancelRecording}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={sendRecording}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (isRecording) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-sm font-medium text-red-700">
              Recording... {formatDuration(duration)}
            </span>
          </div>
          
          <button
            onClick={stopRecording}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <button
      onClick={startRecording}
      className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
    >
      <Mic className="w-5 h-5" />
    </button>
  )
}

export default VoiceRecorder
