import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, ChevronRight, Key, Eye, EyeOff } from 'lucide-react'
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
  const { getApiKey, setApiKey } = useNexusChatStore()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState(true)
  const [apiKeyValue, setApiKeyValue] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  // Show message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 5000)
    }
  }, [location.state])

  // Load existing API key
  useEffect(() => {
    const existingKey = getApiKey()
    if (existingKey) {
      setApiKeyValue(existingKey)
    }
  }, [])

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

        {/* API Key Section */}
        <div className="mb-8">
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-touch-sm h-touch-sm bg-green-100 rounded-mobile flex items-center justify-center">
                <Key className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Heading3>Anthropic API Key</Heading3>
                <Caption>
                  {apiKeyValue ? 'Using direct Anthropic API' : 'Using Supabase Edge Functions (default)'}
                </Caption>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyValue}
                    onChange={(e) => setApiKeyValue(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Caption className="mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    Anthropic Console
                  </a>
                </Caption>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setApiKey(apiKeyValue)
                    setShowMessage(true)
                    // Update location state to show saved message
                    navigate('.', { 
                      replace: true, 
                      state: { message: apiKeyValue ? 'API key saved! Using direct API.' : 'API key removed. Using Supabase.' } 
                    })
                  }}
                  disabled={!apiKeyValue.trim()}
                >
                  Save API Key
                </Button>
                {apiKeyValue && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setApiKeyValue('')
                      setApiKey('')
                      setShowMessage(true)
                      navigate('.', { 
                        replace: true, 
                        state: { message: 'API key removed. Using Supabase Edge Functions.' } 
                      })
                    }}
                  >
                    Clear
                  </Button>
                )}
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