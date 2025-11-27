// src/components/ui/toast.tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, XCircle, Info, Trophy, Sparkles, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: 
          "border-green-200 bg-green-50 text-green-900",
        warning: 
          "border-yellow-200 bg-yellow-50 text-yellow-900",
        info: 
          "border-blue-200 bg-blue-50 text-blue-900",
        // Greek Mindset specific variants
        achievement: 
          "border-greek-gold bg-gradient-to-r from-yellow-50 to-orange-50 text-greek-blue",
        philosophy: 
          "border-greek-blue bg-gradient-to-r from-blue-50 to-purple-50 text-greek-blue",
        spartan: 
          "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 text-red-900",
        marble: 
          "border-marble-300 bg-white/90 backdrop-blur-sm text-gray-900 marble-texture",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

// Enhanced Greek Mindset Toast Components

interface GreekToastProps {
  title: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'philosophy' | 'spartan' | 'marble'
  icon?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  persistent?: boolean
}

/**
 * Enhanced toast with Greek theming and automatic icons
 */
const GreekToast: React.FC<GreekToastProps> = ({
  title,
  description,
  variant = 'info',
  icon,
  action,
  duration = 5000,
  persistent = false,
  ...props
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'achievement':
        return <Trophy className="h-5 w-5 text-greek-gold" />
      case 'philosophy':
        return <span className="text-xl">🤔</span>
      case 'spartan':
        return <span className="text-xl">⚔️</span>
      case 'marble':
        return <Crown className="h-5 w-5 text-greek-gold" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <Toast variant={variant} duration={persistent ? Infinity : duration} {...props}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon || getDefaultIcon()}
        </div>
        <div className="flex-1">
          <ToastTitle>{title}</ToastTitle>
          {description && (
            <ToastDescription className="mt-1">{description}</ToastDescription>
          )}
        </div>
      </div>
      {action}
      <ToastClose />
    </Toast>
  )
}

// Specialized Toast Components for Greek Mindset

/**
 * Achievement toast for celebrating user milestones
 */
interface AchievementToastProps {
  achievement: string
  description?: string
  points?: number
  badge?: string
  onViewAchievements?: () => void
}

const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  description,
  points,
  badge,
  onViewAchievements
}) => (
  <GreekToast
    variant="achievement"
    title={`🏆 Achievement Unlocked!`}
    description={
      <div className="space-y-2">
        <p className="font-semibold text-greek-gold">{achievement}</p>
        {description && <p>{description}</p>}
        {points && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-greek-gold" />
            <span className="text-sm font-medium">+{points} XP earned</span>
          </div>
        )}
        {badge && (
          <span className="inline-block px-2 py-1 bg-greek-gold text-white text-xs rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
    }
    action={
      onViewAchievements && (
        <ToastAction onClick={onViewAchievements}>
          View All
        </ToastAction>
      )
    }
    persistent={true}
  />
)

/**
 * Philosophy quote toast for daily wisdom
 */
interface PhilosophyToastProps {
  quote: string
  author: string
  greekText?: string
  onLearnMore?: () => void
}

const PhilosophyToast: React.FC<PhilosophyToastProps> = ({
  quote,
  author,
  greekText,
  onLearnMore
}) => (
  <GreekToast
    variant="philosophy"
    title="💭 Daily Wisdom"
    description={
      <div className="space-y-2">
        <blockquote className="italic">"{quote}"</blockquote>
        <cite className="text-sm font-medium">— {author}</cite>
        {greekText && (
          <p className="text-xs text-greek-blue font-medium">{greekText}</p>
        )}
      </div>
    }
    action={
      onLearnMore && (
        <ToastAction onClick={onLearnMore}>
          Learn More
        </ToastAction>
      )
    }
    duration={8000}
  />
)

/**
 * Workout completion toast
 */
interface WorkoutToastProps {
  workoutName: string
  duration: number
  caloriesBurned?: number
  difficulty: string
  onViewProgress?: () => void
}

const WorkoutToast: React.FC<WorkoutToastProps> = ({
  workoutName,
  duration,
  caloriesBurned,
  difficulty,
  onViewProgress
}) => (
  <GreekToast
    variant="spartan"
    title="💪 Workout Complete!"
    description={
      <div className="space-y-2">
        <p className="font-semibold">{workoutName}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Duration: {duration} min</div>
          <div>Level: {difficulty}</div>
          {caloriesBurned && (
            <>
              <div>Calories: ~{caloriesBurned}</div>
              <div className="text-red-600 font-medium">💥 Spartan Strong!</div>
            </>
          )}
        </div>
      </div>
    }
    action={
      onViewProgress && (
        <ToastAction onClick={onViewProgress}>
          View Progress
        </ToastAction>
      )
    }
    duration={6000}
  />
)

/**
 * Learning progress toast
 */
interface LearningToastProps {
  subject: string
  progress: number
  milestone?: string
  onContinueLearning?: () => void
}

const LearningToast: React.FC<LearningToastProps> = ({
  subject,
  progress,
  milestone,
  onContinueLearning
}) => (
  <GreekToast
    variant="info"
    title="📚 Learning Progress"
    description={
      <div className="space-y-2">
        <p>Great progress in <span className="font-semibold">{subject}</span>!</p>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm">{progress}% complete</p>
        {milestone && (
          <p className="text-sm font-medium text-blue-700">🎯 {milestone}</p>
        )}
      </div>
    }
    action={
      onContinueLearning && (
        <ToastAction onClick={onContinueLearning}>
          Continue
        </ToastAction>
      )
    }
    duration={5000}
  />
)

/**
 * Welcome toast for new users
 */
interface WelcomeToastProps {
  userName: string
  onGetStarted?: () => void
  onTakeTour?: () => void
}

const WelcomeToast: React.FC<WelcomeToastProps> = ({
  userName,
  onGetStarted,
  onTakeTour
}) => (
  <GreekToast
    variant="marble"
    title={`🏛️ Welcome to The Greek Mindset, ${userName}!`}
    description="Begin your journey of mind and body development with ancient wisdom for modern living."
    action={
      <div className="flex gap-2">
        {onTakeTour && (
          <ToastAction onClick={onTakeTour}>
            Take Tour
          </ToastAction>
        )}
        {onGetStarted && (
          <ToastAction onClick={onGetStarted}>
            Get Started
          </ToastAction>
        )}
      </div>
    }
    persistent={true}
  />
)

/**
 * Error toast with Greek styling
 */
interface ErrorToastProps {
  title?: string
  message: string
  onRetry?: () => void
  onContactSupport?: () => void
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  onContactSupport
}) => (
  <GreekToast
    variant="error"
    title={title}
    description={message}
    action={
      <div className="flex gap-2">
        {onRetry && (
          <ToastAction onClick={onRetry}>
            Retry
          </ToastAction>
        )}
        {onContactSupport && (
          <ToastAction onClick={onContactSupport}>
            Support
          </ToastAction>
        )}
      </div>
    }
    duration={8000}
  />
)

/**
 * Success toast with Greek styling
 */
interface SuccessToastProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

const SuccessToast: React.FC<SuccessToastProps> = ({
  title = "Success!",
  message,
  action
}) => (
  <GreekToast
    variant="success"
    title={title}
    description={message}
    action={
      action && (
        <ToastAction onClick={action.onClick}>
          {action.label}
        </ToastAction>
      )
    }
  />
)

// Toast Hook for easy usage
interface ToastOptions {
  title: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'philosophy' | 'spartan' | 'marble'
  duration?: number
  action?: ToastActionElement
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastOptions[]>([])

  const toast = React.useCallback((options: ToastOptions) => {
    setToasts((prev) => [...prev, { ...options, id: Date.now().toString() }])
  }, [])

  const dismiss = React.useCallback((id?: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  // Greek Mindset specific components
  GreekToast,
  AchievementToast,
  PhilosophyToast,
  WorkoutToast,
  LearningToast,
  WelcomeToast,
  ErrorToast,
  SuccessToast,
}