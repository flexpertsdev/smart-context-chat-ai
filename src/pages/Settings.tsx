
import React from 'react'
import SettingsPage from '../components/settings/SettingsPage'
import AdaptiveLayout from '../components/layout/AdaptiveLayout'

const Settings = () => {
  return (
    <AdaptiveLayout>
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          <SettingsPage />
        </div>
      </div>
    </AdaptiveLayout>
  )
}

export default Settings
