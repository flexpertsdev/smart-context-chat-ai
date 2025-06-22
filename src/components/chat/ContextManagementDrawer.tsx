
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useContextStore } from '../../stores/contextStore'
import { Context } from '../../types'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
import AdaptiveContextCard from '../context/AdaptiveContextCard'
import AIContextGeneratorSheet from './AIContextGeneratorSheet'

interface ContextManagementDrawerProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
  onAttachContexts: (contextIds: string[]) => void
  attachedContexts: Context[]
}

const ContextManagementDrawer = ({ 
  isOpen, 
  onClose, 
  chatId, 
  onAttachContexts, 
  attachedContexts 
}: ContextManagementDrawerProps) => {
  const navigate = useNavigate()
  const { contexts, searchContexts, filteredContexts, searchQuery } = useContextStore()
  const [localSearch, setLocalSearch] = useState('')
  const [selectedContexts, setSelectedContexts] = useState<string[]>([])
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  const attachedIds = attachedContexts.map(c => c.id)
  const availableContexts = contexts.filter(c => !attachedIds.includes(c.id))
  const displayContexts = localSearch ? filteredContexts : availableContexts

  const handleSearch = (query: string) => {
    setLocalSearch(query)
    searchContexts(query)
  }

  const handleToggleContext = (contextId: string) => {
    setSelectedContexts(prev => 
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    )
  }

  const handleAttach = () => {
    if (selectedContexts.length > 0) {
      onAttachContexts(selectedContexts)
      setSelectedContexts([])
      onClose()
    }
  }

  const handleCreateNew = () => {
    setShowAIGenerator(true)
  }

  const handleContextCreated = () => {
    setShowAIGenerator(false)
    // Optionally refresh contexts or show success message
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle>Manage Chat Contexts</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 pb-4 flex-1 flex flex-col min-h-0">
            {/* Search */}
            <div className="relative mb-4 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contexts..."
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Attached Contexts */}
              {attachedContexts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Currently Attached</h3>
                  <div className="space-y-2">
                    {attachedContexts.map((context) => (
                      <AdaptiveContextCard
                        key={context.id}
                        context={context}
                        variant="compact"
                        showUsage={true}
                        showActions={false}
                        className="bg-green-50 border-green-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available Contexts */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Available Contexts</h3>
                  <button 
                    onClick={handleCreateNew}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center space-x-1 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <AnimatePresence>
                    {displayContexts.map((context) => (
                      <motion.div
                        key={context.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative"
                      >
                        <AdaptiveContextCard
                          context={context}
                          variant="compact"
                          showUsage={true}
                          showActions={false}
                          onClick={() => handleToggleContext(context.id)}
                          className={`cursor-pointer transition-colors ${
                            selectedContexts.includes(context.id)
                              ? 'bg-blue-50 border-blue-200'
                              : 'hover:border-gray-300'
                          }`}
                        />
                        {selectedContexts.includes(context.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Actions - Fixed at bottom */}
            {selectedContexts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-2">
                  <button
                    onClick={handleAttach}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Attach {selectedContexts.length} Context{selectedContexts.length !== 1 ? 's' : ''}
                  </button>
                  <button
                    onClick={() => setSelectedContexts([])}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <AIContextGeneratorSheet
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onContextCreated={handleContextCreated}
      />
    </>
  )
}

export default ContextManagementDrawer
