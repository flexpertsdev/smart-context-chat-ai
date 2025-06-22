import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, X, Sparkles, MessageSquare, Brain } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { Button } from '../components/ui/button'
import { useIsMobile } from '../hooks/use-mobile'
import { useNavigate } from 'react-router-dom'

const gradients = [
  'from-emerald-400 via-green-500 to-teal-600',
  'from-blue-400 via-purple-500 to-pink-500', 
  'from-green-400 via-blue-500 to-purple-500',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-indigo-400 via-purple-500 to-pink-500'
]

interface DemoMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  context?: string
  contextAction?: 'suggest' | 'load' | 'create'
  delay: number
  showContextPill?: boolean
  contextSuggestion?: string
}

const demoScenarios = [
  {
    id: 'welcome',
    title: '🧠 Memory-Powered AI Assistant',
    subtitle: 'Unlike ChatGPT, I actually remember everything you tell me across all conversations',
    emoji: '🎬',
    scenario: 'Demo: Planning a birthday party',
    featureHighlight: 'Smart Memory',
    messages: [
      {
        id: '1',
        type: 'user' as const,
        content: 'Help me plan my mom\'s surprise 60th! She loves plants and we\'re expecting 30 people.',
        delay: 4000
      },
      {
        id: '2', 
        type: 'ai' as const,
        content: 'Perfect! 🌱 I can help you plan an amazing party. Should I remember these important details about your mom and the party for future reference?',
        context: '🌱 Mom loves plants • 👥 30 guests • 🎂 60th birthday',
        contextAction: 'suggest',
        contextSuggestion: 'Smart Memory: Save party details',
        delay: 5000,
        showContextPill: true
      },
      {
        id: '3',
        type: 'user' as const,
        content: 'Yes! Budget is around $500. She mentioned wanting to visit that new botanical garden.',
        delay: 4500
      },
      {
        id: '4',
        type: 'ai' as const,
        content: 'Brilliant idea! Since she loves plants, how about hosting the party AT the botanical garden? Perfect fit for her interests and your budget! 🌺',
        context: '💰 $500 budget • 🌺 Botanical garden interest',
        delay: 5000,
        showContextPill: true
      }
    ]
  },
  {
    id: 'context-loading',
    title: '✨ Cross-Chat Memory Magic',
    subtitle: 'Watch how I instantly recall information from completely different conversations',
    emoji: '🔄',
    scenario: 'Demo: Three weeks later...',
    featureHighlight: 'Memory Recall',
    messages: [
      {
        id: '1',
        type: 'user' as const,
        content: 'I need gift ideas for someone who loves plants',
        delay: 4000
      },
      {
        id: '2',
        type: 'ai' as const,
        content: 'Let me check what I remember about plant lovers...',
        delay: 3500
      },
      {
        id: '3',
        type: 'ai' as const,
        content: 'Wait! I remember from our previous chat - your mom loves plants and it\'s her 60th birthday! 🌱 How about a rare succulent collection or beautiful ceramic planters?',
        context: 'Memory Found: Mom\'s Party Planning • 🌱 Plant lover • 🎂 60th birthday',
        contextAction: 'load',
        delay: 5500,
        showContextPill: true
      },
      {
        id: '4',
        type: 'user' as const,
        content: 'OMG YES! You actually remembered! 🤯',
        delay: 4000
      }
    ]
  },
  {
    id: 'learning',
    title: '🚀 AI That Actually Gets Smarter',
    subtitle: 'Help me understand your world better and watch my responses become more personalized',
    emoji: '🧠',
    scenario: 'Demo: Teaching me about your startup',
    featureHighlight: 'Adaptive Learning',
    messages: [
      {
        id: '1',
        type: 'user' as const,
        content: 'How do I market my app to busy parents?',
        delay: 4000
      },
      {
        id: '2',
        type: 'ai' as const,
        content: 'I\'d love to help with marketing! But I don\'t know much about your app yet. Can you tell me what it does?',
        delay: 4500
      },
      {
        id: '3',
        type: 'user' as const,
        content: 'It\'s a meal planning app that generates grocery lists automatically',
        delay: 4000
      },
      {
        id: '4',
        type: 'ai' as const,
        content: 'NOW I can give you targeted advice! 🍽️ For busy parents, try Facebook parent groups and school pickup conversations. Your auto-grocery-list feature is PERFECT for back-to-school season!',
        context: 'New Context: 🍽️ Meal planning app • 🛒 Auto grocery lists • 👨‍👩‍👧‍👦 Target: busy parents',
        contextAction: 'create',
        contextSuggestion: 'Learning: Creating context about your app',
        delay: 6000,
        showContextPill: true
      }
    ]
  },
  {
    id: 'ready',
    title: '🎉 Ready to Start Your Journey?',
    subtitle: 'Time to begin your personalized AI conversation experience!',
    emoji: '🚀',
    scenario: 'Your memory-powered chat awaits',
    featureHighlight: 'Your Turn',
    messages: [
      {
        id: '1',
        type: 'ai' as const,
        content: 'You\'ve seen how I work with memory and learning - now let\'s make it personal! I\'m ready to learn about YOU and help with whatever you\'re working on. 🌟',
        delay: 4000
      },
      {
        id: '2',
        type: 'user' as const,
        content: 'I\'m excited to try this for real!',
        delay: 4000
      },
      {
        id: '3',
        type: 'ai' as const,
        content: 'Perfect! Let\'s start our conversation where I can remember everything and help you achieve your goals! 🚀',
        delay: 4000
      }
    ]
  }
]

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 p-3">
    <img 
      src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/flexpertsdev-pb6ym6/assets/me6dq415a2oq/askflexiRightTransparent500.png" 
      alt="WhatsFLEX AI"
      className="w-6 h-6 rounded-full"
    />
    <span className="text-xs text-gray-500">WhatsFLEX is thinking</span>
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  </div>
)

const ContextPill = ({ message, isVisible }: { message: DemoMessage, isVisible: boolean }) => {
  if (!message.context || !isVisible) return null

  const getContextIcon = () => {
    switch (message.contextAction) {
      case 'suggest': return <Sparkles className="w-3 h-3" />
      case 'load': return <MessageSquare className="w-3 h-3" />
      case 'create': return <Brain className="w-3 h-3" />
      default: return <Sparkles className="w-3 h-3" />
    }
  }

  const getContextColor = () => {
    switch (message.contextAction) {
      case 'suggest': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'load': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'create': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getContextLabel = () => {
    switch (message.contextAction) {
      case 'suggest': return 'Smart Memory Suggestion'
      case 'load': return 'Memory Recalled'
      case 'create': return 'New Context Created'
      default: return 'Context'
    }
  }

  return (
    <motion.div
      className="mt-3 inline-flex flex-col items-start"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <div className="text-xs text-gray-500 mb-1 font-medium">
        {getContextLabel()}
      </div>
      <div className={`text-sm px-3 py-2 rounded-lg border flex items-center gap-2 ${getContextColor()}`}>
        {getContextIcon()}
        {message.context}
      </div>
    </motion.div>
  )
}

const ChatBubble = ({ message, isVisible }: { message: DemoMessage, isVisible: boolean }) => (
  <motion.div
    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-300 ease-out`}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ 
      opacity: isVisible ? 1 : 0, 
      y: isVisible ? 0 : 20,
      scale: isVisible ? 1 : 0.95
    }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
      {message.type === 'ai' && (
        <div className="flex items-center mb-2">
          <img 
            src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/flexpertsdev-pb6ym6/assets/me6dq415a2oq/askflexiRightTransparent500.png" 
            alt="WhatsFLEX AI"
            className="w-7 h-7 rounded-full mr-2"
          />
          <span className="text-sm text-green-600 font-medium">WhatsFLEX</span>
        </div>
      )}
      <div className={`rounded-2xl px-4 py-3 ${
        message.type === 'user' 
          ? 'bg-green-600 text-white rounded-br-sm' 
          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
      <ContextPill message={message} isVisible={isVisible} />
    </div>
  </motion.div>
)

const ChatDemo = ({ scenario, isActive }: { scenario: typeof demoScenarios[0], isActive: boolean }) => {
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set())
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    if (!isActive) return

    let messageIndex = 0
    setVisibleMessages(new Set())

    const playNextMessage = () => {
      if (messageIndex >= scenario.messages.length) return

      const message = scenario.messages[messageIndex]

      if (message.type === 'ai') {
        setShowTyping(true)
        
        setTimeout(() => {
          setShowTyping(false)
          setVisibleMessages(prev => new Set([...prev, message.id]))
          
          const nextDelay = message.showContextPill ? message.delay + 2000 : message.delay
          
          messageIndex++
          setTimeout(playNextMessage, nextDelay)
        }, 2000)
      } else {
        setVisibleMessages(prev => new Set([...prev, message.id]))
        
        messageIndex++
        setTimeout(playNextMessage, message.delay)
      }
    }

    // Initial delay to let users read the header
    setTimeout(playNextMessage, 3000)
  }, [isActive, scenario])

  return (
    <div className="flex-mobile-content bg-gray-50 px-4 py-6">
      {/* Single scroll container with proper bottom alignment */}
      <div className="flex flex-col justify-end min-h-full space-y-4">
        {/* Messages render in order, naturally stacking from bottom */}
        {scenario.messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isVisible={visibleMessages.has(message.id)}
          />
        ))}
        
        {/* Typing indicator at the end */}
        {showTyping && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { completeOnboarding, currentGradient, setGradient } = useAppStore()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  
  const nextStep = () => {
    if (currentStep < demoScenarios.length - 1) {
      setCurrentStep(currentStep + 1)
      const newGradient = gradients[(currentStep + 1) % gradients.length]
      setGradient(newGradient)
    } else {
      handleComplete()
    }
  }
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      const newGradient = gradients[(currentStep - 1) % gradients.length]
      setGradient(newGradient)
    }
  }
  
  const handleComplete = async () => {
    const firstChatId = await completeOnboarding()
    if (firstChatId) {
      navigate(`/chat/${firstChatId}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }
  
  const skipTour = async () => {
    const firstChatId = await completeOnboarding()
    if (firstChatId) {
      navigate(`/chat/${firstChatId}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }
  
  const scenario = demoScenarios[currentStep]
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentGradient} flex items-center justify-center p-4`}>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white shadow-xl border border-white/20 rounded-2xl flex-mobile-container w-full max-w-2xl max-h-[90vh]"
      >
        {/* Fixed Header */}
        <div className="flex-mobile-header bg-white/95 backdrop-blur-sm border-b border-gray-100 rounded-t-2xl">
          {/* Top Navigation */}
          <div className="flex justify-between items-center px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-gray-500 hover:text-gray-700 px-2 h-auto"
            >
              <X className="w-4 h-4 mr-1" />
              Skip
            </Button>
            
            <div className="flex space-x-1">
              {demoScenarios.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <span className="text-sm text-gray-500 font-medium">
              {currentStep + 1}/{demoScenarios.length}
            </span>
          </div>

          {/* Header Content */}
          <div className="text-center px-6 pb-4">
            <motion.div
              className={`${isMobile ? 'text-4xl' : 'text-5xl'} mb-3`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {scenario.emoji}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}
            >
              {scenario.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-green-600 font-medium mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}
            >
              {scenario.subtitle}
            </motion.p>

            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                {scenario.featureHighlight}
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                {scenario.scenario}
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Demo */}
        <ChatDemo scenario={scenario} isActive={true} />
        
        {/* Bottom Navigation */}
        <div className="flex-mobile-footer bg-white border-t border-gray-100 px-4 py-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 text-sm h-10 px-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={nextStep}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 text-sm h-10 px-6"
            >
              <span>{currentStep === demoScenarios.length - 1 ? 'Start Chatting!' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding
