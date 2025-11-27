'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Dumbbell, Music, ChefHat, ArrowLeft } from 'lucide-react'
import { CartProvider } from '@/hooks/use-cart'
import { useDynamicContent } from '@/hooks/use-dynamic-content'

export default function BodyPage() {
  const { getContent, loading: contentLoading, error: contentError } = useDynamicContent('body');
  
  // Debug: Log content loading status
  React.useEffect(() => {
    console.log('Body Page - Content loading:', contentLoading, 'Error:', contentError);
  }, [contentLoading, contentError]);
  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0 px-6 py-12" style={{ backgroundColor: 'rgb(255 255 255 / 50%)' }}>
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
            
            <h1 className="text-5xl md:text-7xl font-bold text-red-800 mb-6">
              {contentLoading ? 'Forge Your Body' : getContent('body.hero.title', 'Forge Your Body')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              {contentLoading ? 'Ancient Strength for Modern Warriors' : getContent('body.hero.subtitle', 'Ancient Strength for Modern Warriors')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {contentLoading ? 'Transform your physical being through time-tested Greek training methods. From Spartan conditioning to Olympic athletics, discover the secrets of ancient Greek physical culture and apply them to build strength, endurance, and grace in your modern life.' : getContent('body.hero.description', 'Transform your physical being through time-tested Greek training methods. From Spartan conditioning to Olympic athletics, discover the secrets of ancient Greek physical culture and apply them to build strength, endurance, and grace in your modern life.')}
            </p>
          </motion.div>

          {/* Three Main Funnels */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Spartan Body Exercises */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <Link href="/body/spartan-workout">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-red-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Dumbbell className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">
                    Spartan Exercises
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Train with the legendary discipline and intensity of Spartan warriors.' : getContent('body.spartan.description', 'Train with the legendary discipline and intensity of Spartan warriors.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-sm">
                      Start Training
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚔️</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Greek Dancing Tutorials */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group"
            >
              <Link href="/body/greek-dancing">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
                    Greek Dancing
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Express yourself through traditional Greek dances that celebrate culture and build coordination.' : getContent('body.dancing.description', 'Express yourself through traditional Greek dances that celebrate culture and build coordination.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm">
                      Start Dancing
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💃</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Greek Cooking Recipes */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="group"
            >
              <Link href="/body/greek-cooking">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-green-200 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <ChefHat className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
                    Greek Cooking
                  </h2>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                    {contentLoading ? 'Nourish your body with authentic Greek recipes and Mediterranean nutrition principles.' : getContent('body.cooking.description', 'Nourish your body with authentic Greek recipes and Mediterranean nutrition principles.')}
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm">
                      Start Cooking
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🥗</span>
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
              Featured Training Programs
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Spartan Warrior Training</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Build strength and endurance like ancient Greek warriors
                </p>
                <Button size="sm" variant="outline">Start Training</Button>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Traditional Dance Forms</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Learn authentic Greek folk dances and celebrations
                </p>
                <Button size="sm" variant="outline">Begin Dancing</Button>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Mediterranean Nutrition</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ancient recipes for optimal health and longevity
                </p>
                <Button size="sm" variant="outline">Explore Recipes</Button>
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
              "No citizen has a right to be an amateur in the matter of training the body" - Socrates
            </blockquote>
            
          </motion.div>
        </div>
      </main>

    </div>
  )
}