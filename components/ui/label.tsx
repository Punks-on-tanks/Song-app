'use client'

import * as React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string
  className?: string
  children: React.ReactNode
}

export function Label({
  htmlFor,
  className = '',
  children,
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium mb-1 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
