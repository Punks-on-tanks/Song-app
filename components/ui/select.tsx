'use client'

import * as React from 'react'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Select({
  value,
  onValueChange,
  children,
  className = '',
  ...props
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div className={`relative ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange,
            open,
            setOpen
          })
        }
        return child
      })}
    </div>
  )
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export function SelectTrigger({
  children,
  className = '',
  open,
  setOpen,
  ...props
}: SelectTriggerProps) {
  return (
    <button
      type="button"
      className={`flex items-center justify-between w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${className}`}
      onClick={() => setOpen?.(!open)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
  open?: boolean
}

export function SelectContent({
  children,
  className = '',
  open,
  ...props
}: SelectContentProps) {
  if (!open) return null
  
  return (
    <div
      className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600 ${className}`}
      {...props}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  onValueChange?: (value: string) => void
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export function SelectItem({
  value,
  children,
  className = '',
  onValueChange,
  setOpen,
  ...props
}: SelectItemProps) {
  const handleClick = () => {
    onValueChange?.(value)
    setOpen?.(false)
  }
  
  return (
    <div
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}

interface SelectValueProps {
  placeholder?: string
  className?: string
  value?: string
  children?: React.ReactNode
}

export function SelectValue({
  placeholder,
  className = '',
  value,
  children,
  ...props
}: SelectValueProps) {
  return (
    <span className={className} {...props}>
      {children || value || placeholder}
    </span>
  )
}
