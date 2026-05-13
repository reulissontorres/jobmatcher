import React from 'react'

export default function LoadingSpinner({ size = 8 }) {
  const s = `${size}rem`
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )
}
