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

  // Создаем ref для компонента
  const selectRef = React.useRef<HTMLDivElement>(null);

  // Добавляем обработчик клика вне компонента для закрытия выпадающего списка
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Создаем обработчик изменения значения
  const handleValueChange = React.useCallback((newValue: string) => {
    console.log(`Select received new value: ${newValue}`);
    onValueChange(newValue);
  }, [onValueChange]);

  return (
    <div
      className={`relative select-container ${className}`}
      ref={selectRef}
      data-current-value={value} // Добавляем атрибут для отладки
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange: handleValueChange,
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
  // Полностью переработанный обработчик клика
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Немедленно вызываем функцию изменения значения
    console.log(`Selecting value: ${value}`)
    if (onValueChange) {
      // Принудительно вызываем функцию обновления значения
      onValueChange(value)

      // Для отладки добавим дополнительный вывод
      console.log(`Value should be updated to: ${value}`)
    } else {
      console.warn('onValueChange is not provided to SelectItem')
    }

    // Закрываем выпадающий список
    if (setOpen) {
      setOpen(false)
    }
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
      data-value={value} // Добавляем атрибут для отладки
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
  // Находим соответствующую метку для значения
  const [displayText, setDisplayText] = React.useState<React.ReactNode>(children || value || placeholder);

  // Обновляем отображаемый текст при изменении значения
  React.useEffect(() => {
    // Если есть дети, используем их
    if (children) {
      setDisplayText(children);
    }
    // Иначе используем значение или плейсхолдер
    else if (value) {
      // Для отладки
      console.log(`SelectValue displaying value: ${value}`);
      setDisplayText(value);
    } else {
      setDisplayText(placeholder);
    }
  }, [children, value, placeholder]);

  return (
    <span
      className={className}
      data-value={value} // Для отладки
      {...props}
    >
      {displayText}
    </span>
  )
}
