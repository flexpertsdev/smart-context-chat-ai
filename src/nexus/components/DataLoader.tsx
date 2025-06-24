import { useEffect, useState } from 'react'
import { useNexusChatStore } from '../stores/nexusChatStore'
import { StorageMigration } from '../utils/storageMigration'
import { clearNexusApiKey } from '../utils/clearApiKey'

const DataLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialize = useNexusChatStore(state => state.initialize)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Run migration first (will be skipped if already done)
        await StorageMigration.migrate()
        
        // Then initialize data from IndexedDB
        await initialize()
        
        // Make clearApiKey available in console for debugging
        if (typeof window !== 'undefined') {
          (window as any).clearNexusApiKey = () => {
            clearNexusApiKey()
            window.location.reload()
          }
          console.log('💡 If you\'re having API issues, run clearNexusApiKey() in the console')
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [initialize])

  // Show loading state while migrating/initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default DataLoader