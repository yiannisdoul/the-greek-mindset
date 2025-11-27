// src/components/ui/slider.tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

// Enhanced Greek Mindset Slider Components

interface GreekSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: 'default' | 'gold' | 'blue' | 'marble'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  showTicks?: boolean
  tickCount?: number
  formatValue?: (value: number) => string
  label?: string
  description?: string
}

/**
 * Greek Mindset themed slider with enhanced styling and features
 */
const GreekSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  GreekSliderProps
>(({ 
  className, 
  variant = 'default', 
  size = 'md',
  showValue = false,
  showTicks = false,
  tickCount = 5,
  formatValue = (value) => value.toString(),
  label,
  description,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props 
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || [min])
  const currentValue = value || internalValue

  const handleValueChange = (newValue: number[]) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  const sizeClasses = {
    sm: {
      track: "h-1",
      thumb: "h-4 w-4 border-[1.5px]",
      container: "py-2"
    },
    md: {
      track: "h-2",
      thumb: "h-5 w-5 border-2",
      container: "py-3"
    },
    lg: {
      track: "h-3",
      thumb: "h-6 w-6 border-2",
      container: "py-4"
    }
  }

  const variantClasses = {
    default: {
      track: "bg-gray-200",
      range: "bg-primary",
      thumb: "border-primary bg-white hover:bg-gray-50"
    },
    gold: {
      track: "bg-yellow-100",
      range: "bg-greek-gold",
      thumb: "border-greek-gold bg-white hover:bg-yellow-50"
    },
    blue: {
      track: "bg-blue-100",
      range: "bg-greek-blue",
      thumb: "border-greek-blue bg-white hover:bg-blue-50"
    },
    marble: {
      track: "bg-marble-200 marble-texture",
      range: "bg-gradient-to-r from-greek-gold to-greek-blue",
      thumb: "border-greek-gold bg-white hover:bg-marble-50 shadow-lg"
    }
  }

  const currentSize = sizeClasses[size]
  const currentVariant = variantClasses[variant]

  // Generate tick marks
  const ticks = React.useMemo(() => {
    if (!showTicks) return []
    const tickArray = []
    const tickStep = (max - min) / (tickCount - 1)
    for (let i = 0; i < tickCount; i++) {
      tickArray.push(min + (tickStep * i))
    }
    return tickArray
  }, [showTicks, tickCount, min, max])

  return (
    <div className={cn("w-full", currentSize.container)}>
      {/* Label and Value Display */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-greek-blue">
              {formatValue(currentValue[0])}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600 mb-3">{description}</p>
      )}

      {/* Slider Container */}
      <div className="relative">
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          value={currentValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          {...props}
        >
          <SliderPrimitive.Track 
            className={cn(
              "relative w-full grow overflow-hidden rounded-full",
              currentSize.track,
              currentVariant.track
            )}
          >
            <SliderPrimitive.Range 
              className={cn(
                "absolute h-full",
                currentVariant.range
              )} 
            />
          </SliderPrimitive.Track>
          
          <SliderPrimitive.Thumb 
            className={cn(
              "block rounded-full ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-greek-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110",
              currentSize.thumb,
              currentVariant.thumb
            )} 
          />
        </SliderPrimitive.Root>

        {/* Tick Marks */}
        {showTicks && (
          <div className="absolute top-full mt-1 w-full flex justify-between">
            {ticks.map((tick, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={cn(
                  "w-0.5 bg-gray-400",
                  size === 'sm' ? 'h-2' : size === 'md' ? 'h-3' : 'h-4'
                )} />
                <span className="text-xs text-gray-500 mt-1">
                  {formatValue(tick)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
GreekSlider.displayName = "GreekSlider"

// Specialized Slider Components for Greek Mindset

interface ProgressSliderProps extends Omit<GreekSliderProps, 'value' | 'onValueChange'> {
  progress: number
  total?: number
  showPercentage?: boolean
}

/**
 * Progress slider for displaying completion progress
 */
const ProgressSlider: React.FC<ProgressSliderProps> = ({
  progress,
  total = 100,
  showPercentage = true,
  label = "Progress",
  variant = 'gold',
  className,
  ...props
}) => {
  const percentage = Math.round((progress / total) * 100)
  
  return (
    <GreekSlider
      value={[percentage]}
      min={0}
      max={100}
      step={1}
      variant={variant}
      label={label}
      showValue={showPercentage}
      formatValue={(value) => `${value}%`}
      className={cn("pointer-events-none", className)}
      {...props}
    />
  )
}

interface TimeSliderProps extends Omit<GreekSliderProps, 'formatValue'> {
  minYear?: number
  maxYear?: number
  currentYear?: number
  onYearChange?: (year: number) => void
  eraMarkers?: Array<{ year: number; label: string; color?: string }>
}

/**
 * Time slider for historical navigation (used in Geography page)
 */
const TimeSlider: React.FC<TimeSliderProps> = ({
  minYear = -3000,
  maxYear = 500,
  currentYear = -500,
  onYearChange,
  eraMarkers = [],
  label = "Historical Timeline",
  variant = 'marble',
  size = 'lg',
  ...props
}) => {
  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : year === 0 ? '0' : `${year} CE`
  }

  const getEraName = (year: number) => {
    if (year >= -800 && year <= -480) return 'Archaic Period'
    if (year >= -480 && year <= -323) return 'Classical Period'
    if (year >= -323 && year <= -146) return 'Hellenistic Period'
    if (year >= -146) return 'Roman Period'
    return 'Bronze Age'
  }

  return (
    <div className="space-y-4">
      <GreekSlider
        value={[currentYear]}
        onValueChange={(value) => onYearChange?.(value[0])}
        min={minYear}
        max={maxYear}
        step={50}
        variant={variant}
        size={size}
        label={label}
        showValue={true}
        formatValue={formatYear}
        description={getEraName(currentYear)}
        showTicks={true}
        tickCount={6}
        {...props}
      />
      
      {/* Era Indicators */}
      <div className="grid grid-cols-4 gap-1 text-xs">
        <div className="text-center p-2 bg-purple-100 rounded text-purple-800">
          <div className="font-medium">Bronze Age</div>
          <div className="text-purple-600">3000-800 BCE</div>
        </div>
        <div className="text-center p-2 bg-blue-100 rounded text-blue-800">
          <div className="font-medium">Archaic</div>
          <div className="text-blue-600">800-480 BCE</div>
        </div>
        <div className="text-center p-2 bg-green-100 rounded text-green-800">
          <div className="font-medium">Classical</div>
          <div className="text-green-600">480-323 BCE</div>
        </div>
        <div className="text-center p-2 bg-yellow-100 rounded text-yellow-800">
          <div className="font-medium">Hellenistic</div>
          <div className="text-yellow-600">323-146 BCE</div>
        </div>
      </div>
    </div>
  )
}

interface VolumeSliderProps extends Omit<GreekSliderProps, 'formatValue' | 'min' | 'max'> {
  volume: number
  onVolumeChange?: (volume: number) => void
  muted?: boolean
  onMutedChange?: (muted: boolean) => void
}

/**
 * Volume slider for audio controls
 */
const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  onVolumeChange,
  muted = false,
  onMutedChange,
  variant = 'blue',
  size = 'sm',
  className,
  ...props
}) => {
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    onVolumeChange?.(newVolume)
    
    // Auto unmute when volume is changed
    if (muted && newVolume > 0) {
      onMutedChange?.(false)
    }
  }

  const formatVolume = (value: number) => `${value}%`

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onMutedChange?.(!muted)}
        className="text-gray-600 hover:text-greek-blue transition-colors"
      >
        {muted || volume === 0 ? (
          <span className="text-lg">🔇</span>
        ) : volume < 50 ? (
          <span className="text-lg">🔉</span>
        ) : (
          <span className="text-lg">🔊</span>
        )}
      </button>
      
      <GreekSlider
        value={[muted ? 0 : volume]}
        onValueChange={handleVolumeChange}
        min={0}
        max={100}
        step={1}
        variant={variant}
        size={size}
        formatValue={formatVolume}
        className={cn("w-24", className)}
        {...props}
      />
    </div>
  )
}

interface RangeSliderProps extends Omit<GreekSliderProps, 'value' | 'onValueChange'> {
  values: [number, number]
  onValuesChange?: (values: [number, number]) => void
  separator?: string
}

/**
 * Range slider for selecting a range of values
 */
const RangeSlider: React.FC<RangeSliderProps> = ({
  values,
  onValuesChange,
  separator = " - ",
  formatValue = (value) => value.toString(),
  showValue = true,
  min = 0,
  max = 100,
  ...props
}) => {
  const handleValueChange = (newValues: number[]) => {
    onValuesChange?.([newValues[0], newValues[1]])
  }

  const formatRangeValue = () => {
    return `${formatValue(values[0])}${separator}${formatValue(values[1])}`
  }

  return (
    <GreekSlider
      value={values}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      showValue={showValue}
      formatValue={formatRangeValue}
      {...props}
    />
  )
}

interface DifficultySliderProps extends Omit<GreekSliderProps, 'formatValue' | 'min' | 'max' | 'step'> {
  difficulty: number
  onDifficultyChange?: (difficulty: number) => void
}

/**
 * Difficulty slider for workout/content difficulty selection
 */
const DifficultySlider: React.FC<DifficultySliderProps> = ({
  difficulty,
  onDifficultyChange,
  variant = 'gold',
  label = "Difficulty Level",
  ...props
}) => {
  const difficultyLabels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Spartan']
  
  const formatDifficulty = (value: number) => {
    return difficultyLabels[value - 1] || 'Beginner'
  }

  return (
    <GreekSlider
      value={[difficulty]}
      onValueChange={(value) => onDifficultyChange?.(value[0])}
      min={1}
      max={5}
      step={1}
      variant={variant}
      label={label}
      showValue={true}
      formatValue={formatDifficulty}
      showTicks={true}
      tickCount={5}
      {...props}
    />
  )
}

export {
  Slider,
  GreekSlider,
  ProgressSlider,
  TimeSlider,
  VolumeSlider,
  RangeSlider,
  DifficultySlider
}