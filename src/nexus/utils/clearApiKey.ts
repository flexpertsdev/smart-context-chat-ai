// Utility to clear API key and switch back to Supabase
export function clearNexusApiKey() {
  localStorage.removeItem('nexus-api-key')
  localStorage.removeItem('nexus-use-direct-api')
  console.log('Nexus API key cleared. Using Supabase Edge Functions.')
}

// Auto-clear on module load if in development and having issues
if (import.meta.env.DEV) {
  const lastError = sessionStorage.getItem('nexus-last-api-error')
  if (lastError && lastError.includes('CORS')) {
    clearNexusApiKey()
    sessionStorage.removeItem('nexus-last-api-error')
    console.log('Auto-cleared API key due to CORS errors')
  }
}