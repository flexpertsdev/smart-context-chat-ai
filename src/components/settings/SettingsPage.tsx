
import React from 'react'
import ProfileSection from './ProfileSection'
import PreferencesSection from './PreferencesSection'
import DemoResetSection from './DemoResetSection'

const SettingsPage = () => {
  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        
        <ProfileSection />
        <PreferencesSection />
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">AI Assistant</h3>
          <p className="text-sm text-blue-700">
            Your AI assistant is powered by Anthropic's Claude and runs securely through our backend. 
            All conversations are processed safely without storing your personal information.
          </p>
        </div>
        
        <DemoResetSection />
      </div>
    </div>
  )
}

export default SettingsPage
