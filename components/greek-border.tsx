'use client'

import React from 'react'

interface GreekBorderProps {
  children: React.ReactNode
}

export function GreekBorder({ children }: GreekBorderProps) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Top Border */}
      <div 
        className="fixed top-0 left-0 right-0 h-8" 
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M0,0 L100,0 L100,100 L0,100 Z M20,20 L80,20 L80,80 L20,80 Z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat-x',
          zIndex: 50
        }}
      />
      
      {/* Left Border */}
      <div 
        className="fixed top-0 left-0 bottom-0 w-8"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M0,0 L100,0 L100,100 L0,100 Z M20,20 L80,20 L80,80 L20,80 Z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat-y',
          zIndex: 50
        }}
      />
      
      {/* Right Border */}
      <div 
        className="fixed top-0 right-0 bottom-0 w-8"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M0,0 L100,0 L100,100 L0,100 Z M20,20 L80,20 L80,80 L20,80 Z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat-y',
          zIndex: 50
        }}
      />

      {/* Content */}
      <div className="px-8">
        {children}
      </div>
    </div>
  )
}

