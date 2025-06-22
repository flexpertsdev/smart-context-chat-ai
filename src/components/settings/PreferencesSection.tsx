
import React from 'react'
import { Moon, Sun, Bell, BellOff, Lightbulb, Zap } from 'lucide-react'
import { Switch } from '../ui/switch'
import { useAppStore } from '../../stores/appStore'

const PreferencesSection = () => {
  const { preferences, updatePreferences } = useAppStore()

  const settingsItems = [
    {
      id: 'theme',
      title: 'Dark Mode',
      description: 'Switch between light and dark theme',
      icon: preferences.theme === 'dark' ? Moon : Sun,
      value: preferences.theme === 'dark',
      onChange: (checked: boolean) => 
        updatePreferences({ theme: checked ? 'dark' : 'light' })
    },
    {
      id: 'liveThinking',
      title: 'Live AI Thinking',
      description: 'Show AI reasoning process in real-time',
      icon: Lightbulb,
      value: preferences.liveThinking,
      onChange: (checked: boolean) => 
        updatePreferences({ liveThinking: checked })
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Receive app notifications',
      icon: preferences.notifications ? Bell : BellOff,
      value: preferences.notifications,
      onChange: (checked: boolean) => 
        updatePreferences({ notifications: checked })
    },
    {
      id: 'autoSuggestContexts',
      title: 'Auto-suggest Contexts',
      description: 'Automatically suggest relevant contexts',
      icon: Zap,
      value: preferences.autoSuggestContexts,
      onChange: (checked: boolean) => 
        updatePreferences({ autoSuggestContexts: checked })
    }
  ]

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-4">Preferences</h3>
      <div className="space-y-1">
        {settingsItems.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
              <Switch
                checked={item.value}
                onCheckedChange={item.onChange}
              />
            </div>
            {index < settingsItems.length - 1 && (
              <div className="border-b border-gray-100 mx-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreferencesSection
