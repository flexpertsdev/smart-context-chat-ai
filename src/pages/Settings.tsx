
import React from 'react'
import SettingsPage from '../components/settings/SettingsPage'

const Settings = () => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <SettingsPage />
      </div>
    </div>
  )
}

export default Settings
