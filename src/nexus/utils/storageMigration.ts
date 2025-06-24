import { NexusStorageService } from '../services/nexusStorageService'

interface LegacyStorageData {
  state?: {
    chats?: any[]
    contexts?: any[]
    selectedContextIds?: string[]
  }
}

export class StorageMigration {
  static readonly MIGRATION_KEY = 'nexus-storage-migrated'
  static readonly LEGACY_STORAGE_KEY = 'nexus-chat-store'

  static async migrate(): Promise<void> {
    // Check if migration has already been done
    if (localStorage.getItem(this.MIGRATION_KEY) === 'true') {
      console.log('Storage migration already completed')
      return
    }

    try {
      console.log('Starting storage migration from localStorage to IndexedDB...')
      
      // Get legacy data from localStorage
      const legacyDataStr = localStorage.getItem(this.LEGACY_STORAGE_KEY)
      if (!legacyDataStr) {
        console.log('No legacy data found in localStorage')
        this.markMigrationComplete()
        return
      }

      const legacyData: LegacyStorageData = JSON.parse(legacyDataStr)
      if (!legacyData.state) {
        console.log('Legacy data has no state')
        this.markMigrationComplete()
        return
      }

      let migratedChats = 0
      let migratedContexts = 0

      // Migrate chats
      if (legacyData.state.chats && Array.isArray(legacyData.state.chats)) {
        for (const chat of legacyData.state.chats) {
          try {
            // Convert lastActivity string to Date if needed
            const migratedChat = {
              ...chat,
              lastActivity: chat.lastActivity ? new Date(chat.lastActivity) : new Date()
            }
            await NexusStorageService.saveChat(migratedChat)
            migratedChats++
          } catch (error) {
            console.error('Failed to migrate chat:', chat.id, error)
          }
        }
      }

      // Migrate contexts
      if (legacyData.state.contexts && Array.isArray(legacyData.state.contexts)) {
        for (const context of legacyData.state.contexts) {
          try {
            await NexusStorageService.saveContext(context)
            migratedContexts++
          } catch (error) {
            console.error('Failed to migrate context:', context.id, error)
          }
        }
      }

      console.log(`Migration complete: ${migratedChats} chats, ${migratedContexts} contexts`)
      
      // Clean up localStorage
      this.cleanupLegacyStorage()
      
      // Mark migration as complete
      this.markMigrationComplete()
      
    } catch (error) {
      console.error('Storage migration failed:', error)
      // Don't mark as complete so it can be retried
    }
  }

  private static cleanupLegacyStorage(): void {
    // Remove the old Zustand persisted data
    localStorage.removeItem(this.LEGACY_STORAGE_KEY)
    
    // Remove any other nexus-related localStorage items
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('nexus-')) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      if (key !== this.MIGRATION_KEY) {
        localStorage.removeItem(key)
      }
    })
    
    console.log(`Cleaned up ${keysToRemove.length} legacy localStorage items`)
  }

  private static markMigrationComplete(): void {
    localStorage.setItem(this.MIGRATION_KEY, 'true')
  }

  static async resetMigration(): Promise<void> {
    // Utility method for testing - removes migration flag
    localStorage.removeItem(this.MIGRATION_KEY)
    console.log('Migration flag reset')
  }
}