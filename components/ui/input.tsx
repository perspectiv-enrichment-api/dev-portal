"use client"

import * as React from 'react'
import { type ComponentType, type HTMLAttributes, useState } from 'react'

import { cn } from '@/lib/utils'

const sizeStyles = {
  sm: {
    root: 'px-3 py-2 text-sm',
    iconLeading: 'left-3 size-4',
    iconTrailing: 'right-3',
    shortcut: 'pr-1.5',
  },
  md: {
    root: 'px-3 py-2 text-base',
    iconLeading: 'left-3 size-5',
    iconTrailing: 'right-3',
    shortcut: 'pr-2',
  },
  lg: {
    root: 'px-3.5 py-2.5 text-base',
    iconLeading: 'left-3.5 size-5',
    iconTrailing: 'right-3.5',
    shortcut: 'pr-2.5',
  },
} as const

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  size?: keyof typeof sizeStyles
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
  icon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>
  tooltip?: string
  shortcut?: string | boolean
  iconClassName?: string
  wrapperClassName?: string
}

function Input({
  className,
  wrapperClassName,
  iconClassName,
  type = 'text',
  size = 'md',
  isDisabled,
  isInvalid,
  isRequired,
  icon: Icon,
  tooltip,
  shortcut,
  disabled,
  required,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const s = sizeStyles[size]
  const resolvedDisabled = isDisabled ?? disabled
  const resolvedInvalid = isInvalid ?? (ariaInvalid === true || ariaInvalid === 'true')

  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        'relative flex w-full items-center rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        resolvedInvalid && 'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        resolvedDisabled && 'cursor-not-allowed opacity-50',
        wrapperClassName,
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            'pointer-events-none absolute text-muted-foreground',
            s.iconLeading,
            iconClassName,
          ) as string}
        />
      )}

      <input
        type={type === 'password' && isPasswordVisible ? 'text' : type}
        data-slot="input"
        disabled={resolvedDisabled}
        required={isRequired ?? required}
        aria-invalid={resolvedInvalid || undefined}
        className={cn(
          'w-full min-w-0 bg-transparent outline-none',
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'disabled:cursor-not-allowed',
          s.root,
          Icon && (size === 'sm' ? 'pl-9' : 'pl-10'),
          (tooltip || resolvedInvalid || type === 'password') && (size === 'lg' ? 'pr-9.5' : 'pr-9'),
          className,
        )}
        {...props}
      />

      {/* Tooltip help icon */}
      {tooltip && type !== 'password' && !resolvedInvalid && (
        <span
          title={tooltip}
          className={cn('absolute cursor-pointer text-muted-foreground', s.iconTrailing)}
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-4 stroke-current stroke-2">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 7v5M8 5.5v.5" strokeLinecap="round" />
          </svg>
        </span>
      )}

      {/* Invalid icon */}
      {resolvedInvalid && type !== 'password' && (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={cn('pointer-events-none absolute size-4 stroke-destructive stroke-2', s.iconTrailing)}
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M8 5v3.5M8 10.5v.5" strokeLinecap="round" />
        </svg>
      )}

      {/* Password toggle */}
      {type === 'password' && (
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={() => setIsPasswordVisible(v => !v)}
          className={cn(
            'absolute flex cursor-pointer items-center justify-center text-muted-foreground transition hover:text-foreground focus:outline-none',
            s.iconTrailing,
          )}
        >
          {isPasswordVisible ? (
            <svg viewBox="0 0 24 24" fill="none" className="size-4 stroke-current stroke-2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="size-4 stroke-current stroke-2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}

      {/* Keyboard shortcut badge */}
      {shortcut && (
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0.5 right-0.5 hidden items-center rounded-r-[inherit] bg-gradient-to-r from-transparent to-background to-40% pl-8 md:flex',
            s.shortcut,
          )}
        >
          <span className="rounded px-1 py-px text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border select-none">
            {typeof shortcut === 'string' ? shortcut : '⌘K'}
          </span>
        </div>
      )}
    </div>
  )
}

export { Input }
