
// // src/components/common/typewriter-text.tsx
// 'use client'

// import React, { useState, useEffect, useCallback } from 'react'
// import { cn } from '@/lib/utils'

// interface TypewriterTextProps {
//   text: string | string[]
//   delay?: number
//   className?: string
//   cursorClassName?: string
//   showCursor?: boolean
//   loop?: boolean
//   deleteSpeed?: number
//   pauseBetweenTexts?: number
//   startDelay?: number
//   onComplete?: () => void
//   onTextComplete?: (textIndex: number) => void
// }

// export function TypewriterText({
//   text,
//   delay = 100,
//   className = '',
//   cursorClassName = '',
//   showCursor = true,
//   loop = false,
//   deleteSpeed = 50,
//   pauseBetweenTexts = 2000,
//   startDelay = 0,
//   onComplete,
//   onTextComplete
// }: TypewriterTextProps) {
//   const texts = Array.isArray(text) ? text : [text]
//   const [displayedText, setDisplayedText] = useState('')
//   const [currentTextIndex, setCurrentTextIndex] = useState(0)
//   const [currentCharIndex, setCurrentCharIndex] = useState(0)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [isWaiting, setIsWaiting] = useState(false)
//   const [hasStarted, setHasStarted] = useState(false)
//   const [showCursorBlink, setShowCursorBlink] = useState(true)

//   const currentText = texts[currentTextIndex] || ''

//   const resetToStart = useCallback(() => {
//     setCurrentTextIndex(0)
//     setCurrentCharIndex(0)
//     setDisplayedText('')
//     setIsDeleting(false)
//     setIsWaiting(false)
//   }, [])

//   const completeCurrentText = useCallback(() => {
//     if (onTextComplete) {
//       onTextComplete(currentTextIndex)
//     }
//   }, [currentTextIndex, onTextComplete])

//   const completeAllTexts = useCallback(() => {
//     if (onComplete) {
//       onComplete()
//     }
//   }, [onComplete])

//   useEffect(() => {
//     if (!hasStarted) {
//       const startTimer = setTimeout(() => {
//         setHasStarted(true)
//       }, startDelay)
//       return () => clearTimeout(startTimer)
//     }

//     if (isWaiting) {
//       const waitTimer = setTimeout(() => {
//         setIsWaiting(false)
//         if (texts.length > 1) {
//           if (loop) {
//             setIsDeleting(true)
//           } else if (currentTextIndex < texts.length - 1) {
//             setIsDeleting(true)
//           } else {
//             completeAllTexts()
//           }
//         } else {
//           completeAllTexts()
//         }
//       }, pauseBetweenTexts)
//       return () => clearTimeout(waitTimer)
//     }

//     if (isDeleting) {
//       if (currentCharIndex > 0) {
//         const deleteTimer = setTimeout(() => {
//           setDisplayedText(currentText.substring(0, currentCharIndex - 1))
//           setCurrentCharIndex(currentCharIndex - 1)
//         }, deleteSpeed)
//         return () => clearTimeout(deleteTimer)
//       } else {
//         // Finished deleting, move to next text or restart loop
//         setIsDeleting(false)
//         if (loop) {
//           setCurrentTextIndex((currentTextIndex + 1) % texts.length)
//         } else if (currentTextIndex < texts.length - 1) {
//           setCurrentTextIndex(currentTextIndex + 1)
//         }
//       }
//     } else {
//       if (currentCharIndex < currentText.length) {
//         const typeTimer = setTimeout(() => {
//           setDisplayedText(currentText.substring(0, currentCharIndex + 1))
//           setCurrentCharIndex(currentCharIndex + 1)
//         }, delay)
//         return () => clearTimeout(typeTimer)
//       } else if (currentCharIndex === currentText.length) {
//         // Finished typing current text
//         completeCurrentText()
//         if (texts.length > 1) {
//           setIsWaiting(true)
//         } else {
//           // Single text completed
//           completeAllTexts()
//         }
//       }
//     }
//   }, [
//     hasStarted,
//     currentCharIndex,
//     currentText,
//     delay,
//     deleteSpeed,
//     isDeleting,
//     isWaiting,
//     pauseBetweenTexts,
//     texts.length,
//     loop,
//     currentTextIndex,
//     startDelay,
//     completeCurrentText,
//     completeAllTexts
//   ])

//   // Cursor blinking effect
//   useEffect(() => {
//     if (!showCursor) return

//     const blinkInterval = setInterval(() => {
//       setShowCursorBlink(prev => !prev)
//     }, 530)

//     return () => clearInterval(blinkInterval)
//   }, [showCursor])

//   if (!hasStarted) {
//     return (
//       <span className={cn('inline-block', className)}>
//         {showCursor && (
//           <span className={cn(
//             'inline-block w-0.5 h-[1em] bg-current ml-1 animate-pulse',
//             cursorClassName
//           )} />
//         )}
//       </span>
//     )
//   }

//   return (
//     <span className={cn('inline-block', className)}>
//       {displayedText}
//       {showCursor && (
//         <span 
//           className={cn(
//             'inline-block w-0.5 h-[1em] bg-current ml-1 transition-opacity duration-100',
//             showCursorBlink ? 'opacity-100' : 'opacity-0',
//             cursorClassName
//           )}
//         />
//       )}
//     </span>
//   )
// }

// // Advanced Typewriter with multiple effects
// interface AdvancedTypewriterProps extends Omit<TypewriterTextProps, 'text'> {
//   texts: string[]
//   typeMode?: 'typewriter' | 'fade' | 'slide'
//   highlightColor?: string
//   highlightWords?: string[]
// }

// export function AdvancedTypewriter({
//   texts,
//   typeMode = 'typewriter',
//   highlightColor = '#D4AF37',
//   highlightWords = [],
//   className = '',
//   ...props
// }: AdvancedTypewriterProps) {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isVisible, setIsVisible] = useState(true)

//   const highlightText = (text: string) => {
//     if (highlightWords.length === 0) return text

//     let highlightedText = text
//     highlightWords.forEach(word => {
//       const regex = new RegExp(`\\b${word}\\b`, 'gi')
//       highlightedText = highlightedText.replace(
//         regex,
//         `<span style="color: ${highlightColor}; font-weight: 600;">${word}</span>`
//       )
//     })
//     return highlightedText
//   }

//   const handleTextComplete = () => {
//     if (typeMode === 'fade') {
//       setTimeout(() => {
//         setIsVisible(false)
//         setTimeout(() => {
//           setCurrentIndex((prev) => (prev + 1) % texts.length)
//           setIsVisible(true)
//         }, 300)
//       }, 1000)
//     }
//   }

//   if (typeMode === 'fade') {
//     return (
//       <div className={cn(
//         'transition-all duration-300',
//         isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2',
//         className
//       )}>
//         <TypewriterText
//           text={texts[currentIndex]}
//           onComplete={handleTextComplete}
//           {...props}
//         />
//       </div>
//     )
//   }

//   if (typeMode === 'slide') {
//     return (
//       <div className={cn('overflow-hidden', className)}>
//         <TypewriterText
//           text={texts}
//           loop
//           {...props}
//         />
//       </div>
//     )
//   }

//   // Default typewriter mode with highlighting
//   return (
//     <div 
//       className={className}
//       dangerouslySetInnerHTML={{
//         __html: highlightText(texts[currentIndex] || texts[0])
//       }}
//     />
//   )
// }

// // Simple Typewriter Hook for custom implementations
// export function useTypewriter(
//   text: string,
//   delay: number = 100,
//   startDelay: number = 0
// ) {
//   const [displayedText, setDisplayedText] = useState('')
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isComplete, setIsComplete] = useState(false)
//   const [hasStarted, setHasStarted] = useState(false)

//   useEffect(() => {
//     if (!hasStarted) {
//       const startTimer = setTimeout(() => {
//         setHasStarted(true)
//       }, startDelay)
//       return () => clearTimeout(startTimer)
//     }

//     if (currentIndex < text.length) {
//       const timer = setTimeout(() => {
//         setDisplayedText(text.substring(0, currentIndex + 1))
//         setCurrentIndex(currentIndex + 1)
//       }, delay)
//       return () => clearTimeout(timer)
//     } else if (currentIndex === text.length && !isComplete) {
//       setIsComplete(true)
//     }
//   }, [currentIndex, text, delay, isComplete, hasStarted, startDelay])

//   const reset = () => {
//     setDisplayedText('')
//     setCurrentIndex(0)
//     setIsComplete(false)
//     setHasStarted(false)
//   }

//   return {
//     displayedText,
//     isComplete,
//     reset,
//     progress: text.length > 0 ? (currentIndex / text.length) * 100 : 0
//   }
// }

// // Typewriter with sound effects (optional)
// interface TypewriterWithSoundProps extends TypewriterTextProps {
//   enableSound?: boolean
//   soundUrl?: string
//   volume?: number
// }

// export function TypewriterWithSound({
//   enableSound = false,
//   soundUrl = '/sounds/typewriter-click.mp3',
//   volume = 0.3,
//   ...props
// }: TypewriterWithSoundProps) {
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

//   useEffect(() => {
//     if (enableSound && typeof window !== 'undefined') {
//       const audioElement = new Audio(soundUrl)
//       audioElement.volume = volume
//       setAudio(audioElement)
//     }
//   }, [enableSound, soundUrl, volume])

//   const playSound = () => {
//     if (audio && enableSound) {
//       audio.currentTime = 0
//       audio.play().catch(() => {
//         // Ignore errors (user hasn't interacted with page yet)
//       })
//     }
//   }

//   return (
//     <TypewriterText
//       {...props}
//       onTextComplete={() => {
//         playSound()
//         props.onTextComplete?.()
//       }}
//     />
//   )
// }

// // Export default component
// export default TypewriterText


// src/components/common/typewriter-text.tsx
'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  delay?: number
  className?: string
}

export function TypewriterText({ text, delay = 100, className = '' }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(currentIndex + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, delay])

  return (
    <span className={`${className} typewriter`}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}