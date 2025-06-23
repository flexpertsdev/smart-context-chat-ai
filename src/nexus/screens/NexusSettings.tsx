import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'
import { useNavigate } from 'react-router-dom'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
  action: () => void
}

const NexusSettings: React.FC = () => {
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState(true)

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
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Heading1 className="mb-2">Settings</Heading1>
          <Body color="secondary">Manage your preferences and account</Body>
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
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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