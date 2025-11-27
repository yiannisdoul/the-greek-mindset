// src/components/home/mission-statement.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { TypewriterText } from '@/components/common/typewriter-text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Heart, 
  Users, 
  Lightbulb,
  BookOpen,
  Dumbbell,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  Shield,
  Compass,
  Trophy,
  Brain
} from 'lucide-react'
import Link from 'next/link'

interface CoreValue {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  greekConcept: string
  color: string
  bgColor: string
}

interface MissionPillar {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  benefits: string[]
  color: string
}

const coreValues: CoreValue[] = [
  {
    id: 'arete',
    icon: Crown,
    title: 'Excellence (Arete)',
    description: 'We pursue excellence in all aspects of life, striving for continuous improvement in both mind and body.',
    greekConcept: 'Ἀρετή',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 'sophia',
    icon: Brain,
    title: 'Wisdom (Sophia)',
    description: 'We seek knowledge and understanding, drawing from ancient wisdom to solve modern challenges.',
    greekConcept: 'Σοφία',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'andreia',
    icon: Shield,
    title: 'Courage (Andreia)',
    description: 'We embrace challenges with courage, pushing beyond comfort zones to achieve personal growth.',
    greekConcept: 'Ἀνδρεία',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  },
  {
    id: 'dikaiosyne',
    icon: Users,
    title: 'Justice (Dikaiosyne)',
    description: 'We act with fairness and integrity, building a community based on mutual respect and support.',
    greekConcept: 'Δικαιοσύνη',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  }
]

const missionPillars: MissionPillar[] = [
  {
    id: 'mind',
    icon: BookOpen,
    title: 'Cultivate the Mind',
    description: 'Develop intellectual capacity through philosophy, history, and critical thinking.',
    benefits: [
      'Ancient Greek philosophy courses',
      'Critical thinking development',
      'Historical perspective gaining',
      'Ethical decision-making skills'
    ],
    color: 'text-purple-600'
  },
  {
    id: 'body',
    icon: Dumbbell,
    title: 'Strengthen the Body',
    description: 'Build physical capability through functional movement and holistic health practices.',
    benefits: [
      'Spartan-inspired workouts',
      'Functional movement patterns',
      'Mediterranean nutrition',
      'Mental resilience training'
    ],
    color: 'text-red-600'
  },
  {
    id: 'community',
    icon: Globe,
    title: 'Unite the Community',
    description: 'Create connections between like-minded individuals pursuing excellence together.',
    benefits: [
      'Global learning community',
      'Peer support networks',
      'Cultural exchange programs',
      'Collaborative growth initiatives'
    ],
    color: 'text-blue-600'
  }
]

export function MissionStatement() {
  const [activeValue, setActiveValue] = useState<string | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const greekPattern = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Animated Greek Pattern Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="greek-meander" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <motion.path
                d="M0,5 L2,5 L2,2 L5,2 L5,8 L8,8 L8,5 L10,5"
                stroke="url(#gradient)"
                strokeWidth="0.5"
                fill="none"
                variants={greekPattern}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              />
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#003f7f" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#greek-meander)" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          {/* Mission Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Badge variant="gold" className="mb-4 text-sm px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Our Sacred Mission
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold text-greek-blue mb-6">
              Φιλοσοφία & Σῶμα
            </h2>
            <p className="text-xl text-gray-600 mb-4">Philosophy & Body</p>
          </motion.div>

          {/* Main Mission Statement */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-marble-200">
              <div className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-6">
                <TypewriterText
                  text="To empower individuals worldwide with the timeless wisdom of ancient Greece, fostering the development of both mind and body through authentic philosophical teachings and practical physical training that leads to a life of excellence, virtue, and fulfillment."
                  delay={30}
                  className="font-medium"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-greek-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-8 w-8 text-greek-gold" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Ancient Wisdom</h3>
                  <p className="text-sm text-gray-600">Timeless principles for modern living</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-greek-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-greek-blue" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Holistic Development</h3>
                  <p className="text-sm text-gray-600">Mind and body in perfect harmony</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Global Community</h3>
                  <p className="text-sm text-gray-600">United in pursuit of excellence</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Core Values Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-greek-blue mb-4">
              The Four Cardinal Virtues
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on Plato's Republic, these virtues form the foundation of our approach to personal development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setActiveValue(value.id)}
                onHoverEnd={() => setActiveValue(null)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  activeValue === value.id 
                    ? `${value.bgColor} shadow-xl transform scale-105` 
                    : 'bg-white/80 border-marble-200 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    activeValue === value.id ? 'bg-white shadow-lg' : 'bg-gray-100'
                  } transition-all duration-300`}>
                    <value.icon className={`h-8 w-8 ${value.color} transition-colors duration-300`} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h4>
                  <div className={`text-2xl font-bold mb-3 ${value.color}`}>{value.greekConcept}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  
                  {activeValue === value.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Core Virtue
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Decorative corner elements */}
                <div className={`absolute top-2 right-2 w-3 h-3 ${value.color.replace('text-', 'bg-')} rounded-full opacity-30`} />
                <div className={`absolute bottom-2 left-2 w-2 h-2 ${value.color.replace('text-', 'bg-')} rounded-full opacity-20`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Pillars Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-greek-blue mb-4">
              Three Pillars of Excellence
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach to human development through ancient Greek principles
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {missionPillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-marble-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <pillar.icon className={`h-10 w-10 ${pillar.color}`} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">{pillar.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </div>

                <div className="space-y-3">
                  {pillar.benefits.map((benefit, benefitIndex) => (
                    <motion.div
                      key={benefitIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.1 * benefitIndex }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className={`h-5 w-5 ${pillar.color} flex-shrink-0`} />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" className="w-full group">
                    <span>Explore {pillar.title}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-greek-blue to-greek-gold rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Begin Your Journey to Excellence
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands who have discovered the transformative power of combining ancient wisdom 
                with modern practice. Your path to a more fulfilled life starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-greek-blue hover:bg-gray-100 font-semibold">
                    <Trophy className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                </Link>
                
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Compass className="mr-2 h-5 w-5" />
                    Learn Our Story
                  </Button>
                </Link>
              </div>

              <div className="flex justify-center items-center gap-6 mt-8 text-sm opacity-75">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Free to Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>10,000+ Members</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MissionStatement