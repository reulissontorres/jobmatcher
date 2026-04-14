'use client'

import { ChevronDown } from 'lucide-react'

export default function FormSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  required = false
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-3 rounded-lg appearance-none
            bg-muted/50 border border-input
            text-foreground
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all duration-200
            ${!value ? 'text-muted-foreground' : ''}
            ${error ? 'border-destructive focus:ring-destructive' : ''}
          `}
        >
          <option value="" disabled className="text-muted-foreground">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-foreground">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={20} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
        />
      </div>
      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  )
}
