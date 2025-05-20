'use client'

import * as React from 'react'

// Создаем контекст для RadioGroup
interface RadioGroupContextType {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextType>({
  value: '',
  onValueChange: () => {}
})

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
  // Предоставляем контекст для дочерних компонентов
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`flex gap-4 ${className}`} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
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
  // Получаем контекст из родительского RadioGroup
  const context = React.useContext(RadioGroupContext)

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={context.value === value}
      onChange={() => context.onValueChange(value)}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
      {...props}
    />
  )
}
