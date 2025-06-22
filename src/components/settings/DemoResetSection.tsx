
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useAppStore } from '../../stores/appStore'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

const DemoResetSection = () => {
  const { resetForDemo } = useAppStore()
  const navigate = useNavigate()
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await resetForDemo()
      // Navigate to onboarding page after reset
      navigate('/onboarding', { replace: true })
    } catch (error) {
      console.error('Reset failed:', error)
      setIsResetting(false)
    }
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-red-800 mb-2">Demo Reset</h3>
          <p className="text-sm text-red-700 mb-4">
            Reset the app to its initial state for demonstrations. This will delete all chats, contexts, 
            and user data, then show the walkthrough tour again.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                disabled={isResetting}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isResetting ? 'Resetting...' : 'Reset for Demo'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center space-x-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span>Confirm Demo Reset</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  <strong className="text-red-600">This action cannot be undone.</strong>
                  <br /><br />
                  This will permanently delete:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All chat conversations</li>
                    <li>All contexts and documents</li>
                    <li>User preferences and settings</li>
                    <li>All local data</li>
                  </ul>
                  <br />
                  The app will restart and show the walkthrough tour as if it's being used for the first time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default DemoResetSection
