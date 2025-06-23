import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Save, Mail, Phone, Globe, MapPin, Briefcase, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'

interface ProfileData {
  name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  occupation: string
  joinedDate: Date
  avatar?: string
}

const NexusProfile: React.FC = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Full-stack developer passionate about building great user experiences. Love working with React, TypeScript, and modern web technologies.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    occupation: 'Senior Software Engineer',
    joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // 1 year ago
    avatar: undefined
  })
  const [editedData, setEditedData] = useState<ProfileData>(profileData)

  const handleEdit = () => {
    setEditedData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(profileData)
    setIsEditing(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData({ ...editedData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const displayData = isEditing ? editedData : profileData

  return (
    <AdaptiveLayout onNewChat={() => navigate('/nexus/chats/new')}>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/nexus/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Heading1>Profile</Heading1>
            <div className="flex-1" />
            {!isEditing ? (
              <Button
                variant="primary"
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar and Basic Info */}
        <div className="mb-6">
          <Card padding="lg">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {displayData.avatar ? (
                  <img
                    src={displayData.avatar}
                    alt={displayData.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {displayData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="text-2xl font-bold w-full bg-transparent border-b-2 border-gray-300 focus:border-green-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{displayData.name}</h2>
                )}
                
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.occupation}
                    onChange={(e) => setEditedData({ ...editedData, occupation: e.target.value })}
                    className="text-gray-600 w-full bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    placeholder="Your occupation"
                  />
                ) : (
                  <p className="text-gray-600">{displayData.occupation}</p>
                )}

                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <Caption>Joined {formatJoinDate(displayData.joinedDate)}</Caption>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <Card padding="lg">
            <Heading3 className="mb-4">About</Heading3>
            {isEditing ? (
              <textarea
                value={editedData.bio}
                onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                className="w-full min-h-[100px] bg-transparent resize-none focus:outline-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <Body>{displayData.bio}</Body>
            )}
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <Card padding="lg">
            <Heading3 className="mb-4">Contact Information</Heading3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                  />
                ) : (
                  <span>{displayData.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    placeholder="Phone number"
                  />
                ) : (
                  <span>{displayData.phone}</span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    placeholder="Location"
                  />
                ) : (
                  <span>{displayData.location}</span>
                )}
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                {isEditing ? (
                  <input
                    type="url"
                    value={editedData.website}
                    onChange={(e) => setEditedData({ ...editedData, website: e.target.value })}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    placeholder="Website URL"
                  />
                ) : (
                  <a
                    href={displayData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    {displayData.website}
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdaptiveLayout>
  )
}

export default NexusProfile