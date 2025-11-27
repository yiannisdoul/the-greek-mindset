'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Scroll, MapPin, Zap, BookOpen, ArrowLeft } from 'lucide-react'
import { CartProvider } from '@/hooks/use-cart'
import { useDynamicContent } from '@/hooks/use-dynamic-content'

export default function MindPage() {
  const { getContent, loading: contentLoading, error: contentError } = useDynamicContent('mind');
  
  // Debug: Log content loading status
  React.useEffect(() => {
    console.log('Mind Page - Content loading:', contentLoading, 'Error:', contentError);
  }, [contentLoading, contentError]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6 md:hidden">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-blue-800 mb-6">
              {contentLoading ? 'Cultivate Your Mind' : getContent('mind.hero.title', 'Cultivate Your Mind')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              {contentLoading ? 'Ancient Wisdom for Modern Minds' : getContent('mind.hero.subtitle', 'Ancient Wisdom for Modern Minds')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {contentLoading ? 'Embark on an intellectual journey through the rich tapestry of Greek civilization. From the philosophical insights of Socrates and Plato to the heroic tales of mythology, discover the knowledge that shaped Western thought and continues to inspire minds today.' : getContent('mind.hero.description', 'Embark on an intellectual journey through the rich tapestry of Greek civilization. From the philosophical insights of Socrates and Plato to the heroic tales of mythology, discover the knowledge that shaped Western thought and continues to inspire minds today.')}
            </p>
          </motion.div>

          {/* Four Main Funnels */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* History */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <Link href="/mind/history">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-amber-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Scroll className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
                    History
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Journey through the rise and fall of Greek city-states, wars, and the events that shaped civilization.' : getContent('mind.history.description', 'Journey through the rise and fall of Greek city-states, wars, and the events that shaped civilization.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 text-sm">
                      Explore Timeline
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Geography */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group"
            >
              <Link href="/mind/geography">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-green-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
                    Geography
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Discover the landscapes, islands, and regions that formed the backdrop of Greek civilization.' : getContent('mind.geography.description', 'Discover the landscapes, islands, and regions that formed the backdrop of Greek civilization.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm">
                      View Maps
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🗺️</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Mythology */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="group"
            >
              <Link href="/mind/mythology">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-purple-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
                    Mythology
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Delve into the captivating world of Greek gods, heroes, and legendary tales that continue to inspire.' : getContent('mind.mythology.description', 'Delve into the captivating world of Greek gods, heroes, and legendary tales that continue to inspire.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-sm">
                      Enter Myths
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="group"
            >
              <Link href="/mind/philosophy">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
                    Philosophy
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Explore the fundamental questions of existence, ethics, and knowledge through the lens of ancient Greek philosophers.' : getContent('mind.philosophy.description', 'Explore the fundamental questions of existence, ethics, and knowledge through the lens of ancient Greek philosophers.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm">
                      Seek Wisdom
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🤔</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Featured Content Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Featured Learning Paths
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">The Great Philosophers</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Journey through the minds of Socrates, Plato, and Aristotle
                </p>
                <Button size="sm" variant="outline">Start Journey</Button>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Heroes & Legends</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Explore the epic tales of Hercules, Perseus, and Theseus
                </p>
                <Button size="sm" variant="outline">Begin Quest</Button>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Rise & Fall of Empires</h4>
                <p className="text-sm text-gray-600 mb-3">
                  From city-states to Alexander's vast empire
                </p>
                <Button size="sm" variant="outline">Explore History</Button>
              </div>
            </div>
          </motion.div>

          {/* Quote & Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 text-center"
          >
            <blockquote className="text-lg text-gray-600 mb-6 italic">
              "The unexamined life is not worth living" - Socrates
            </blockquote>
            <div className="hidden md:block">
              <Link href="/">
                <Button variant="outline" className="px-6 py-3">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}