'use client'

import * as React from 'react'

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function RadioGroup({
  value,
  onValueChange,
  className = '',
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div className={`flex gap-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  id: string
}

export function RadioGroupItem({
  value,
  id,
  ...props
}: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
      {...props}
    />
  )
}
