// src/components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        purple:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
        pink:
          "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200",
        indigo:
          "border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        gray:
          "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
        // Greek-themed variants
        gold:
          "border-transparent bg-greek-gold/20 text-greek-gold hover:bg-greek-gold/30",
        greek:
          "border-transparent bg-greek-blue/20 text-greek-blue hover:bg-greek-blue/30",
        olive:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded",
        lg: "rounded-lg",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  onRemove?: () => void
  removable?: boolean
}

function Badge({ 
  className, 
  variant, 
  size, 
  rounded,
  icon,
  onRemove,
  removable = false,
  children,
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, rounded }), className)} {...props}>
      {icon && (
        <span className="mr-1 flex items-center">
          {icon}
        </span>
      )}
      {children}
      {(removable || onRemove) && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-black/20"
          aria-label="Remove badge"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// Animated Badge Component
interface AnimatedBadgeProps extends BadgeProps {
  animate?: boolean
  pulseColor?: string
}

function AnimatedBadge({ 
  animate = false, 
  pulseColor = "bg-red-500",
  className,
  children,
  ...props 
}: AnimatedBadgeProps) {
  return (
    <div className="relative inline-flex">
      <Badge className={className} {...props}>
        {children}
      </Badge>
      {animate && (
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            pulseColor
          )}></span>
          <span className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            pulseColor
          )}></span>
        </span>
      )}
    </div>
  )
}

// Notification Badge Component
interface NotificationBadgeProps extends Omit<BadgeProps, 'children'> {
  count?: number
  max?: number
  showZero?: boolean
  dot?: boolean
}

function NotificationBadge({
  count = 0,
  max = 99,
  showZero = false,
  dot = false,
  className,
  ...props
}: NotificationBadgeProps) {
  if (!showZero && count === 0) {
    return null
  }

  const displayCount = count > max ? `${max}+` : count.toString()

  if (dot) {
    return (
      <Badge 
        className={cn("h-2 w-2 p-0 min-w-0", className)} 
        {...props}
      />
    )
  }

  return (
    <Badge 
      className={cn("min-w-[1.25rem] justify-center", className)} 
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

// Status Badge Component
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'success' | 'error' | 'warning' | 'info'
  withDot?: boolean
}

function StatusBadge({ 
  status, 
  withDot = false,
  className,
  children,
  ...props 
}: StatusBadgeProps) {
  const statusConfig = {
    online: { variant: 'success' as const, color: 'bg-green-500', label: 'Online' },
    offline: { variant: 'gray' as const, color: 'bg-gray-500', label: 'Offline' },
    away: { variant: 'warning' as const, color: 'bg-yellow-500', label: 'Away' },
    busy: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Busy' },
    success: { variant: 'success' as const, color: 'bg-green-500', label: 'Success' },
    error: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Error' },
    warning: { variant: 'warning' as const, color: 'bg-yellow-500', label: 'Warning' },
    info: { variant: 'info' as const, color: 'bg-blue-500', label: 'Info' },
  }

  const config = statusConfig[status]

  return (
    <Badge 
      variant={config.variant}
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      {withDot && (
        <span className={cn("w-2 h-2 rounded-full", config.color)} />
      )}
      {children || config.label}
    </Badge>
  )
}

// Category Badge for Greek Mindset
interface CategoryBadgeProps extends Omit<BadgeProps, 'variant'> {
  category: 'history' | 'geography' | 'mythology' | 'philosophy' | 'body' | 'mind' | 'beginner' | 'intermediate' | 'advanced'
}

function CategoryBadge({ 
  category, 
  className,
  children,
  ...props 
}: CategoryBadgeProps) {
  const categoryConfig = {
    history: { variant: 'gold' as const, icon: '🏛️' },
    geography: { variant: 'success' as const, icon: '🗺️' },
    mythology: { variant: 'purple' as const, icon: '⚡' },
    philosophy: { variant: 'greek' as const, icon: '🤔' },
    body: { variant: 'destructive' as const, icon: '💪' },
    mind: { variant: 'info' as const, icon: '🧠' },
    beginner: { variant: 'success' as const, icon: '🌱' },
    intermediate: { variant: 'warning' as const, icon: '🔥' },
    advanced: { variant: 'destructive' as const, icon: '⚔️' },
  }

  const config = categoryConfig[category]

  return (
    <Badge 
      variant={config.variant}
      icon={<span className="text-xs">{config.icon}</span>}
      className={className}
      {...props}
    >
      {children || category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  )
}

// Progress Badge
interface ProgressBadgeProps extends Omit<BadgeProps, 'children'> {
  progress: number
  total?: number
  showPercentage?: boolean
  format?: 'fraction' | 'percentage'
}

function ProgressBadge({
  progress,
  total = 100,
  showPercentage = false,
  format = 'percentage',
  className,
  ...props
}: ProgressBadgeProps) {
  const percentage = Math.round((progress / total) * 100)
  
  const getVariant = (percent: number) => {
    if (percent >= 90) return 'success'
    if (percent >= 70) return 'warning' 
    if (percent >= 50) return 'info'
    return 'gray'
  }

  const displayValue = format === 'fraction' 
    ? `${progress}/${total}`
    : `${percentage}%`

  return (
    <Badge 
      variant={getVariant(percentage)}
      className={className}
      {...props}
    >
      {displayValue}
    </Badge>
  )
}

// Rating Badge
interface RatingBadgeProps extends Omit<BadgeProps, 'children'> {
  rating: number
  maxRating?: number
  showStars?: boolean
}

function RatingBadge({
  rating,
  maxRating = 5,
  showStars = true,
  className,
  ...props
}: RatingBadgeProps) {
  const stars = Math.round(rating)
  
  return (
    <Badge 
      variant="gold"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {showStars && (
        <div className="flex">
          {[...Array(maxRating)].map((_, i) => (
            <span 
              key={i}
              className={`text-xs ${i < stars ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
      )}
      {rating.toFixed(1)}
    </Badge>
  )
}

export { 
  Badge, 
  badgeVariants,
  AnimatedBadge,
  NotificationBadge,
  StatusBadge,
  CategoryBadge,
  ProgressBadge,
  RatingBadge
}