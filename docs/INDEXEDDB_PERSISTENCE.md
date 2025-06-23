# IndexedDB Persistence Implementation

## Overview

The Nexus UI system now uses IndexedDB for local data persistence instead of Supabase. This provides offline-first functionality and eliminates the need for backend infrastructure during development.

## Architecture

### Database Structure

```typescript
// NexusDatabase (via Dexie.js)
├── chats table
│   ├── id (primary key)
│   ├── title
│   ├── lastActivity (indexed)
│   └── lastMessage (JSON)
├── messages table
│   ├── id (primary key)
│   ├── chatId (indexed)
│   ├── timestamp (indexed)
│   ├── sender (indexed)
│   └── thinking (JSON)
└── contexts table
    ├── id (primary key)
    ├── title (indexed)
    ├── category (indexed)
    └── tags
```

### Key Components

1. **NexusStorageService** (`src/nexus/services/nexusStorageService.ts`)
   - Handles all IndexedDB operations
   - Provides async methods for CRUD operations
   - Manages data serialization/deserialization
   - Includes data export/import functionality

2. **DataLoader** (`src/nexus/components/DataLoader.tsx`)
   - Loads persisted data on app startup
   - Wraps the entire Nexus app
   - Ensures data is available before rendering

3. **nexusChatStore** Integration
   - Automatically persists data on every state change
   - Calls NexusStorageService methods for:
     - Chat creation/updates
     - Message saving
     - Context CRUD operations

## Data Flow

### On App Startup
```
1. DataLoader component mounts
2. Calls loadFromStorage() from nexusChatStore
3. NexusStorageService loads:
   - All chats (sorted by lastActivity)
   - All contexts
   - Messages for each chat
4. Data populates Zustand store
5. App renders with persisted data
```

### During Usage
```
1. User performs action (send message, create context, etc.)
2. Zustand store updates state
3. Store method calls NexusStorageService
4. Data saved to IndexedDB
5. UI reflects changes immediately
```

## Key Features

### 1. Automatic Persistence
- All chats, messages, and contexts persist automatically
- No explicit save actions required
- Data survives page refreshes and browser restarts

### 2. Offline Support
- Full functionality without internet connection
- Data stored locally in browser
- No sync conflicts to manage

### 3. Data Export/Import
```typescript
// Export all data
const blob = await NexusStorageService.exportData()
// Returns JSON blob with all chats, messages, contexts

// Import data
await NexusStorageService.importData(jsonString)
```

### 4. Search Capabilities
```typescript
// Search contexts by title, description, or tags
const results = await NexusStorageService.searchContexts("react")
```

### 5. Default Content
- Automatically creates default contexts on first load
- Provides immediate value for new users

## Migration from Supabase

The system previously used Supabase for persistence. Key changes:

1. **No Authentication Required**
   - Data stored per browser/device
   - No user accounts needed

2. **Local-First Architecture**
   - No network requests for data operations
   - Instant read/write performance

3. **Simplified Setup**
   - No API keys or backend configuration
   - Works immediately after installation

## Testing Data Persistence

### Manual Testing
1. Create a new chat and send messages
2. Create or edit contexts
3. Refresh the page
4. Verify all data persists

### Browser DevTools
1. Open DevTools > Application tab
2. Navigate to IndexedDB > NexusDatabase
3. Inspect tables: chats, messages, contexts
4. Verify data structure and content

### Debug Commands
```javascript
// In browser console

// Export all data
const { NexusStorageService } = await import('./src/nexus/services/nexusStorageService.ts')
const blob = await NexusStorageService.exportData()
const url = URL.createObjectURL(blob)
console.log('Download data:', url)

// Clear all data (careful!)
await NexusStorageService.clearAllData()

// Check specific chat messages
const messages = await NexusStorageService.loadMessages('chat-id-here')
console.table(messages)
```

## Limitations

1. **Browser Storage Limits**
   - IndexedDB has browser-specific storage quotas
   - Typically 50MB-1GB depending on browser and available disk space

2. **Device-Specific Data**
   - Data doesn't sync across devices
   - Each browser/device has separate storage

3. **No Real-Time Sync**
   - Changes don't propagate to other sessions
   - Single-user, single-device experience

## Future Enhancements

1. **Sync Capabilities**
   - Optional cloud sync with Firebase/Appwrite
   - Import/export to cloud storage
   - Device-to-device sync via WebRTC

2. **Storage Management**
   - Storage usage indicators
   - Automatic cleanup of old data
   - Compression for large datasets

3. **Advanced Features**
   - Full-text search across all content
   - Data versioning and history
   - Incremental backups

## Troubleshooting

### Data Not Persisting
1. Check browser privacy settings (private/incognito mode)
2. Verify IndexedDB is enabled in browser
3. Check browser console for errors
4. Ensure sufficient storage space

### Performance Issues
1. Large number of messages may slow initial load
2. Consider implementing pagination for messages
3. Use browser profiler to identify bottlenecks

### Data Corruption
1. Export data regularly as backup
2. Use clearAllData() to reset if needed
3. Check browser console for Dexie errors

## Code Examples

### Adding New Persistence
```typescript
// In a store action
const saveCustomData = async (data: CustomType) => {
  // Update store state
  set(state => ({ customData: data }))
  
  // Persist to IndexedDB
  await NexusStorageService.saveCustomData(data)
}
```

### Loading on Startup
```typescript
// In loadFromStorage method
const customData = await NexusStorageService.loadCustomData()
set({ customData })
```

## Summary

The IndexedDB persistence implementation provides a robust, offline-first data storage solution for the Nexus UI system. It eliminates backend dependencies during development while maintaining full functionality. The system is designed to be transparent to users while providing developers with powerful data management capabilities.