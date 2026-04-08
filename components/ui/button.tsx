"use client"

import * as React from 'react'
import { type FC, type ReactNode, isValidElement } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type IconProp = FC<{ className?: string }> | ReactNode

function isReactComponent(value: unknown): value is FC<{ className?: string }> {
  return typeof value === 'function'
}

const spinnerIcon = 'pointer-events-none size-4 shrink-0 animate-spin'

function Button({
  className,
  variant,
  size,
  asChild = false,
  isDisabled,
  isLoading = false,
  showTextWhileLoading = false,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  href,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isDisabled?: boolean
    isLoading?: boolean
    showTextWhileLoading?: boolean
    iconLeading?: IconProp
    iconTrailing?: IconProp
    href?: string
  }) {
  const disabled = isDisabled || props.disabled

  if (href) {
    return (
      <a
        data-slot="button"
        href={disabled || isLoading ? undefined : href}
        aria-disabled={disabled || isLoading}
        className={cn(
          buttonVariants({ variant, size, className }),
          (disabled || isLoading) && 'pointer-events-none opacity-50',
        )}
      >
        <ButtonContent
          IconLeading={IconLeading}
          IconTrailing={IconTrailing}
          isLoading={isLoading}
          showTextWhileLoading={showTextWhileLoading}
        >
          {children}
        </ButtonContent>
      </a>
    )
  }

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      disabled={disabled || isLoading}
      className={cn(
        buttonVariants({ variant, size, className }),
        isLoading && 'relative',
      )}
      {...props}
    >
      <ButtonContent
        IconLeading={IconLeading}
        IconTrailing={IconTrailing}
        isLoading={isLoading}
        showTextWhileLoading={showTextWhileLoading}
      >
        {children}
      </ButtonContent>
    </Comp>
  )
}

function ButtonContent({
  children,
  IconLeading,
  IconTrailing,
  isLoading,
  showTextWhileLoading,
}: {
  children?: ReactNode
  IconLeading?: IconProp
  IconTrailing?: IconProp
  isLoading: boolean
  showTextWhileLoading: boolean
}) {
  return (
    <>
      {!isLoading && isValidElement(IconLeading) && IconLeading}
      {!isLoading && isReactComponent(IconLeading) && <IconLeading className="pointer-events-none size-4 shrink-0" />}

      {isLoading && (
        <svg
          fill="none"
          viewBox="0 0 20 20"
          className={cn(spinnerIcon, !showTextWhileLoading && 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}
        >
          <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
          <circle
            className="origin-center animate-spin stroke-current"
            cx="10" cy="10" r="8" fill="none"
            strokeWidth="2" strokeDasharray="12.5 50" strokeLinecap="round"
          />
        </svg>
      )}

      {children && (
        <span className={cn(isLoading && !showTextWhileLoading && 'invisible')}>
          {children}
        </span>
      )}

      {isValidElement(IconTrailing) && IconTrailing}
      {isReactComponent(IconTrailing) && <IconTrailing className="pointer-events-none size-4 shrink-0" />}
    </>
  )
}

export { Button, buttonVariants }
