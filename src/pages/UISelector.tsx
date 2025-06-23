import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Smartphone, Monitor } from 'lucide-react'

const UISelector: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Experience
          </h1>
          <p className="text-gray-600">
            Select the interface that works best for you
          </p>
        </div>

        <div className="space-y-4">
          {/* Mobile UI Option */}
          <motion.button
            onClick={() => navigate('/mobile')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4 border-2 border-transparent hover:border-green-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Mobile Experience
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                WhatsApp-style interface optimized for mobile devices
              </p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                New!
              </span>
            </div>
          </motion.button>

          {/* Desktop UI Option */}
          <motion.button
            onClick={() => navigate('/home')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4 border-2 border-transparent hover:border-blue-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Desktop Experience
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Full-featured interface with advanced layouts
              </p>
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Original
              </span>
            </div>
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            You can switch between interfaces anytime from Settings
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default UISelector