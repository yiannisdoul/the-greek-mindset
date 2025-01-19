'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'

export default function Home() {
  const [hoveredSection, setHoveredSection] = useState<'warrior' | 'philosopher' | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Warrior Section */}
          <motion.div
            className="relative h-[600px] bg-black/40 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredSection('warrior')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <Image
              src="/images/light-logo.jpeg"
              alt="Warrior Spirit"
              width={300}
              height={300}
              className="mb-8"
            />
            <h2 className="text-4xl font-bold text-white mb-4">Build Strength and Resilience</h2>
            <p className="text-gray-300 text-center mb-8">
              Embrace the Spartan way of life through disciplined training and warrior mindset
            </p>
            <Button 
              variant="outline" 
              className="bg-red-600 text-white border-red-500 hover:bg-red-700"
            >
              Begin Training
            </Button>
          </motion.div>

          {/* Philosopher Section */}
          <motion.div
            className="relative h-[600px] bg-black/40 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredSection('philosopher')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <Image
              src="/images/dark-logo.jpeg"
              alt="Philosophy and Wisdom"
              width={300}
              height={300}
              className="mb-8"
            />
            <h2 className="text-4xl font-bold text-white mb-4">Build Wisdom and Knowledge</h2>
            <p className="text-gray-300 text-center mb-8">
              Discover the timeless wisdom of Greek philosophy and ancient knowledge
            </p>
            <Button 
              variant="outline" 
              className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
            >
              Start Learning
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

