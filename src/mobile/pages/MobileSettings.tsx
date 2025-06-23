import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Key, 
  Bell, 
  Lock, 
  MessageCircle,
  HelpCircle,
  Users,
  LogOut,
  ChevronRight,
  Palette,
  Wifi
} from 'lucide-react'
import MobileLayout from '../layouts/MobileLayout'

interface SettingItem {
  icon: React.ElementType
  label: string
  description?: string
  onClick: () => void
  value?: string
}

const MobileSettings: React.FC = () => {
  const navigate = useNavigate()

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: 'Edit your profile information',
          onClick: () => {}
        },
        {
          icon: Key,
          label: 'Privacy',
          description: 'Last seen, profile photo, about',
          onClick: () => {}
        }
      ]
    },
    {
      title: 'Chats',
      items: [
        {
          icon: Palette,
          label: 'Theme',
          description: 'Light',
          onClick: () => {}
        },
        {
          icon: MessageCircle,
          label: 'Chat Backup',
          description: 'Last backup: Today at 2:00 AM',
          onClick: () => {}
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Message, group & call tones',
          onClick: () => {}
        }
      ]
    },
    {
      title: 'Help',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          onClick: () => {}
        },
        {
          icon: Users,
          label: 'Contact Us',
          onClick: () => {}
        },
        {
          icon: Lock,
          label: 'Privacy Policy',
          onClick: () => {}
        }
      ]
    }
  ]

  return (
    <MobileLayout
      headerProps={{
        title: 'Settings',
        variant: 'settings',
        onBack: () => navigate('/mobile')
      }}
    >
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Profile Section */}
        <motion.div 
          className="bg-white px-4 py-4 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-900">John Doe</h2>
              <p className="text-sm text-gray-600">+1 234 567 8900</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div 
            key={section.title}
            className="bg-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
          >
            <h3 className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
            
            {section.items.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={index}
                  onClick={item.onClick}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className="text-gray-900 font-medium">{item.label}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  
                  {item.value && (
                    <span className="text-sm text-gray-500 mr-2">{item.value}</span>
                  )}
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>
              )
            })}
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.div 
          className="bg-white mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 flex items-center text-red-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-medium">Log Out</span>
          </button>
        </motion.div>

        {/* App Info */}
        <div className="px-4 py-4 text-center">
          <p className="text-xs text-gray-500">
            WhatsApp Clone v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </MobileLayout>
  )
}

export default MobileSettings