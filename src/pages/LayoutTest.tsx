
import React from 'react'

const LayoutTest = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-0">
      {/* Blue container that takes available space */}
      <div className="flex-1 bg-blue-500 p-4 overflow-y-auto min-h-0">
        <h1 className="text-white text-2xl font-bold mb-4">Blue Container (Flex-1)</h1>
        <p className="text-white">This container should take up all available space.</p>
        {/* Add some content to test scrolling */}
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i} className="text-white mb-2">
            Content line {i + 1} - This is test content to see how the layout behaves with scrolling.
          </p>
        ))}
      </div>
      
      {/* Red container at the bottom */}
      <div className="bg-red-500 p-4 text-white flex-shrink-0">
        <p>Red Container - This should be at the bottom</p>
      </div>
    </div>
  )
}

export default LayoutTest
