import { useEffect } from 'react'
import { useNexusChatStore } from '../stores/nexusChatStore'

const DataLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadFromStorage = useNexusChatStore(state => state.loadFromStorage)
  
  useEffect(() => {
    // Load data from IndexedDB on mount
    loadFromStorage()
  }, [])

  return <>{children}</>
}

export default DataLoader