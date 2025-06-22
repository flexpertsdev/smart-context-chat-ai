
import React from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '../ui/badge'

interface TagFilterBarProps {
  availableTags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onTagDeselect: (tag: string) => void
  onAddCustomTag: (tag: string) => void
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onAddCustomTag
}) => {
  const [showCustomInput, setShowCustomInput] = React.useState(false)
  const [customTag, setCustomTag] = React.useState('')

  const handleAddCustomTag = () => {
    if (customTag.trim() && !availableTags.includes(customTag.trim())) {
      onAddCustomTag(customTag.trim())
      setCustomTag('')
      setShowCustomInput(false)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hidden">
        {/* Selected tags */}
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="default"
            className="bg-green-600 text-white flex items-center space-x-1 whitespace-nowrap"
          >
            <span>{tag}</span>
            <button
              onClick={() => onTagDeselect(tag)}
              className="ml-1 hover:bg-green-700 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {/* Available tags */}
        {availableTags
          .filter(tag => !selectedTags.includes(tag))
          .map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 whitespace-nowrap"
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </Badge>
          ))}

        {/* Add custom tag */}
        {showCustomInput ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustomTag()
                if (e.key === 'Escape') setShowCustomInput(false)
              }}
              placeholder="New tag"
              className="text-sm border border-gray-300 rounded px-2 py-1 w-20"
              autoFocus
            />
            <button
              onClick={handleAddCustomTag}
              className="text-green-600 hover:text-green-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TagFilterBar
