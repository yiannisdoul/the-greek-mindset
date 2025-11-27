// src/components/home/hero-section.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { TypewriterText } from '@/components/common/typewriter-text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Dumbbell, 
  Brain, 
  Star, 
  Users, 
  Trophy, 
  BookOpen,
  Play,
  Sparkles,
  Target,
  Heart,
  Zap,
  Clock,
  Globe
} from 'lucide-react'

interface HeroStats {
  users: string
  workouts: string
  articles: string
  rating: string
}

const heroStats: HeroStats = {
  users: '10,000+',
  workouts: '500+',
  articles: '1,000+',
  rating: '4.9'
}

const motivationalQuotes = [
  {
    text: "A sound mind in a sound body",
    author: "Juvenal",
    greek: "Νοῦς ὑγιὴς ἐν σώματι ὑγιεῖ"
  },
  {
    text: "The unexamined life is not worth living",
    author: "Socrates",
    greek: "Ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ"
  },
  {
    text: "Excellence is never an accident",
    author: "Aristotle",
    greek: "Ἀρετὴ οὐδὲν τύχης ἔργον"
  },
  {
    text: "Know thyself",
    author: "Delphic Oracle",
    greek: "Γνῶθι σεαυτόν"
  }
]

export function HeroSection() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
        setIsVisible(true)
      }, 500)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const currentQuote = motivationalQuotes[currentQuoteIndex]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Greek Symbols */}
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-6xl opacity-10 text-greek-gold"
        >
          Φ
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [20, -20, 20],
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 text-8xl opacity-10 text-greek-blue"
        >
          Σ
        </motion.div>

        <motion.div
          animate={{ 
            y: [-30, 30, -30],
            rotate: [0, 10, 0, -10, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-32 left-1/4 text-5xl opacity-10 text-greek-gold"
        >
          Ω
        </motion.div>

        {/* Decorative Geometric Patterns */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-greek-gold/20 rounded-full"
        />
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-greek-blue/20"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Badge variant="gold" className="mb-4 text-sm px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Ancient Wisdom for Modern Living
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-greek-blue leading-tight">
              The Greek
              <span className="block text-greek-gold">Mindset</span>
            </h1>
            
            <div className="text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto">
              <TypewriterText
                text="Cultivate your mind and strengthen your body through the timeless principles of Greek philosophy and physical culture."
                delay={50}
                className="leading-relaxed"
              />
            </div>
          </motion.div>

          {/* Animated Quote Section */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto border border-marble-200 shadow-lg"
              >
                <div className="text-lg md:text-xl font-medium text-gray-800 mb-2">
                  "{currentQuote.text}"
                </div>
                <div className="text-sm text-gray-600 mb-2">— {currentQuote.author}</div>
                <div className="text-xs text-greek-gold font-medium">{currentQuote.greek}</div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Main Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-8 justify-center items-center max-w-6xl mx-auto">
            {/* Body Section Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full lg:w-1/2"
            >
              <Link href="/body">
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-600 hover:border-red-400">
                  <div className="flex flex-col items-center space-y-4 text-white">
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4"
                      >
                        <Dumbbell className="h-12 w-12" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                      >
                        <Zap className="h-3 w-3 text-red-600" />
                      </motion.div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold">BODY</h2>
                    <p className="text-red-100 text-center max-w-sm">
                      Train like a Spartan warrior. Develop functional strength, agility, and endurance 
                      through ancient Greek training methods.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Target className="h-3 w-3 mr-1" />
                        Spartan Workouts
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Heart className="h-3 w-3 mr-1" />
                        Greek Dancing
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {/* <Utensils className="h-3 w-3 mr-1" /> */}
                        Healthy Recipes
                      </Badge>
                    </div>
                    
                    <Button className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 group-hover:scale-105 transition-transform">
                      Begin Physical Training
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Mind Section Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full lg:w-1/2"
            >
              <Link href="/mind">
                <div className="bg-gradient-to-br from-blue-500 to-purple-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-600 hover:border-blue-400">
                  <div className="flex flex-col items-center space-y-4 text-white">
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 0, 5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4"
                      >
                        <Brain className="h-12 w-12" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="h-3 w-3 text-blue-600" />
                      </motion.div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold">MIND</h2>
                    <p className="text-blue-100 text-center max-w-sm">
                      Explore the depths of Greek philosophy, history, and culture. Sharpen your intellect 
                      with wisdom that has guided humanity for millennia.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Philosophy
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Globe className="h-3 w-3 mr-1" />
                        History
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Zap className="h-3 w-3 mr-1" />
                        Mythology
                      </Badge>
                    </div>
                    
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 group-hover:scale-105 transition-transform">
                      Begin Mental Training
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-marble-200 shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-greek-blue mr-2" />
                <div className="text-2xl font-bold text-greek-blue">{heroStats.users}</div>
              </div>
              <div className="text-sm text-gray-600 text-center">Active Members</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-marble-200 shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <Dumbbell className="h-6 w-6 text-red-600 mr-2" />
                <div className="text-2xl font-bold text-red-600">{heroStats.workouts}</div>
              </div>
              <div className="text-sm text-gray-600 text-center">Workout Programs</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-marble-200 shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
                <div className="text-2xl font-bold text-purple-600">{heroStats.articles}</div>
              </div>
              <div className="text-sm text-gray-600 text-center">Learning Articles</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-marble-200 shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2 fill-current" />
                <div className="text-2xl font-bold text-yellow-600">{heroStats.rating}</div>
              </div>
              <div className="text-sm text-gray-600 text-center">User Rating</div>
            </div>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/about">
              <Button variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn More About Us
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                <Trophy className="mr-2 h-5 w-5" />
                Explore Our Shop
              </Button>
            </Link>
            
            <Button variant="ghost" size="lg" className="text-greek-blue hover:bg-white/50">
              <Play className="mr-2 h-5 w-5" />
              Watch Introduction
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-greek-gold rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-greek-gold rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 pointer-events-none" />
    </section>
  )
}

export default HeroSection