import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NexusHome from './screens/NexusHome'
import NexusChat from './screens/NexusChat'
import NexusContexts from './screens/NexusContexts'
import { AnimatePresence } from 'framer-motion'

const NexusApp: React.FC = () => {
  return (
    <Router basename="/nexus">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<NexusHome />} />
          <Route path="/chats" element={<div>Chat List</div>} />
          <Route path="/chats/new" element={<NexusChat />} />
          <Route path="/chats/:chatId" element={<NexusChat />} />
          <Route path="/contexts" element={<NexusContexts />} />
          <Route path="/contexts/new" element={<div>Create Context</div>} />
          <Route path="/contexts/:contextId" element={<div>Context Details</div>} />
          <Route path="/insights" element={<div>AI Insights</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default NexusApp