
import React, { useState } from 'react'
import { Camera, Edit2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAppStore } from '../../stores/appStore'

const ProfileSection = () => {
  const { user, updateUser } = useAppStore()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempName, setTempName] = useState(user?.name || '')
  const [tempBio, setTempBio] = useState(user?.bio || '')

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateUser({ name: tempName.trim() })
      setIsEditingName(false)
    }
  }

  const handleSaveBio = () => {
    updateUser({ bio: tempBio.trim() })
    setIsEditingBio(false)
  }

  const handleCancelName = () => {
    setTempName(user?.name || '')
    setIsEditingName(false)
  }

  const handleCancelBio = () => {
    setTempBio(user?.bio || '')
    setIsEditingBio(false)
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl bg-green-100 text-green-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Name Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Name</label>
        {isEditingName ? (
          <div className="flex space-x-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName()
                if (e.key === 'Escape') handleCancelName()
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleSaveName} className="bg-green-600 hover:bg-green-700">
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelName}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-gray-900">{user?.name}</span>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bio Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">About</label>
        {isEditingBio ? (
          <div className="space-y-2">
            <Input
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              placeholder="Add a status..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveBio()
                if (e.key === 'Escape') handleCancelBio()
              }}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSaveBio} className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelBio}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsEditingBio(true)}
          >
            <span className="text-gray-700">{user?.bio || 'Add a status...'}</span>
            <Edit2 className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileSection
