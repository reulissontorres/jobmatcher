import { Sparkles } from 'lucide-react'

export default function Logo({ size = 'default' }) {
  const sizeClasses = {
    small: 'w-12 h-12',
    default: 'w-16 h-16',
    large: 'w-20 h-20'
  }

  const iconSizes = {
    small: 24,
    default: 32,
    large: 40
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg`}
    >
      <Sparkles 
        size={iconSizes[size]} 
        className="text-white" 
        strokeWidth={2}
      />
    </div>
  )
}
