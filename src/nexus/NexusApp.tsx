import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NexusHome from './screens/NexusHome'
import NexusChat from './screens/NexusChat'
import NexusChatList from './screens/NexusChatList'
import NexusContexts from './screens/NexusContexts'
import NexusContextDetails from './screens/NexusContextDetails'
import NexusContextGeneration from './screens/NexusContextGeneration'
import NexusInsights from './screens/NexusInsights'
import NexusSettings from './screens/NexusSettings'
import NexusProfile from './screens/NexusProfile'
import NexusShowcase from './NexusShowcase'
import DataLoader from './components/DataLoader'

const NexusApp: React.FC = () => {
  return (
    <DataLoader>
      <Routes>
      <Route path="/" element={<NexusHome />} />
      <Route path="/showcase" element={<NexusShowcase />} />
      <Route path="/chats" element={<NexusChatList />} />
      <Route path="/chats/new" element={<NexusChat />} />
      <Route path="/chats/:chatId" element={<NexusChat />} />
      <Route path="/contexts" element={<NexusContexts />} />
      <Route path="/contexts/new" element={<NexusContextGeneration />} />
      <Route path="/contexts/generate" element={<NexusContextGeneration />} />
      <Route path="/contexts/:contextId" element={<NexusContextDetails />} />
      <Route path="/insights" element={<NexusInsights />} />
      <Route path="/settings" element={<NexusSettings />} />
      <Route path="/profile" element={<NexusProfile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </DataLoader>
  )
}

export default NexusApp