import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, ChevronRight, Key, Check } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNexusChatStore } from '../stores/nexusChatStore'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
  action: () => void
}

const NexusSettings: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState(true)
  const [showMessage, setShowMessage] = useState(false)

  // Show message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 5000)
    }
  }, [location.state])


  const settingSections: SettingSection[] = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your personal information',
      icon: User,
      action: () => navigate('/nexus/profile')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure notification preferences',
      icon: Bell,
      action: () => console.log('Notifications')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your data and privacy settings',
      icon: Shield,
      action: () => console.log('Privacy')
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the look and feel',
      icon: Palette,
      action: () => console.log('Appearance')
    },
    {
      id: 'language',
      title: 'Language & Region',
      description: 'Set your preferred language',
      icon: Globe,
      action: () => console.log('Language')
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      action: () => console.log('Help')
    }
  ]

  return (
    <AdaptiveLayout onNewChat={() => navigate('/nexus/chats/new')}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Heading1 className="mb-2">Settings</Heading1>
          <Body color="secondary">Manage your preferences and account</Body>
        </div>

        {/* Message Alert */}
        {showMessage && location.state?.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <p className="text-amber-800">{location.state.message}</p>
          </motion.div>
        )}

        {/* AI Service Info */}
        <div className="mb-8">
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-touch-sm h-touch-sm bg-green-100 rounded-mobile flex items-center justify-center">
                <Key className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Heading3>AI Service</Heading3>
                <Caption>
                  Powered by Claude via secure server-side functions
                </Caption>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <Body className="font-medium text-green-900">No API key needed</Body>
                    <Caption className="text-green-700 mt-1">
                      This app uses secure server-side functions to communicate with Claude. 
                      Your conversations are processed safely without exposing any API keys in the browser.
                    </Caption>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <Caption className="text-gray-600">
                  <strong>How it works:</strong> All AI requests are securely routed through Netlify Functions, 
                  which handle the authentication with Anthropic's API. This ensures your data remains private 
                  and secure.
                </Caption>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Settings */}
        <div className="mb-8">
          <Card padding="lg">
            <Heading3 className="mb-4">Quick Settings</Heading3>
            
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Body className="font-medium">Dark Mode</Body>
                  <Caption>Use dark theme across the app</Caption>
                </div>
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Body className="font-medium">Push Notifications</Body>
                  <Caption>Receive notifications for new messages</Caption>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Setting Sections */}
        <div className="space-y-3">
          {settingSections.map((section) => {
            const Icon = section.icon
            return (
              <Card
                key={section.id}
                hoverable
                onClick={section.action}
                padding="md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-touch-sm h-touch-sm bg-gray-100 rounded-mobile flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <Body className="font-medium">{section.title}</Body>
                    <Caption>{section.description}</Caption>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Sign Out */}
        <div className="mt-8">
          <Button
            variant="danger"
            fullWidth
            icon={<LogOut className="w-4 h-4" />}
            onClick={() => {
              console.log('Sign out')
              navigate('/')
            }}
          >
            Sign Out
          </Button>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <Caption>Nexus UI v1.0.0</Caption>
        </div>
      </div>
    </AdaptiveLayout>
  )
}

export default NexusSettings