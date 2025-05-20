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

  // Добавляем обработчик клика вне компонента для закрытия выпадающего списка
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const selectElement = document.querySelector('.select-container');
      if (selectElement && !selectElement.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative select-container ${className}`} {...props}>
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
  // Улучшенный обработчик клика
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Добавляем задержку для более надежного срабатывания
    setTimeout(() => {
      console.log(`Selecting value: ${value}`)
      if (onValueChange) {
        onValueChange(value)
      }
      if (setOpen) {
        setOpen(false)
      }
    }, 10);
  }

  // Добавляем обработчик нажатия клавиши Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e as unknown as React.MouseEvent)
    }
  }

  return (
    <div
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="option"
      aria-selected={false}
      tabIndex={0}
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
