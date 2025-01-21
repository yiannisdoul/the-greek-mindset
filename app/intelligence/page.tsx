'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArticleCard } from '@/components/article-card'

const articles = [
  {
    id: '1',
    title: 'The Stoic Philosophy of Marcus Aurelius',
    excerpt: 'Explore the wisdom of the philosopher king and how it applies to modern life.',
    category: 'Philosophy',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Sophia Athena',
    date: 'May 15, 2025'
  },
  {
    id: '2',
    title: 'Spartan Training Techniques for Mental Toughness',
    excerpt: 'Learn how to build resilience and mental strength using ancient Spartan methods.',
    category: 'Fitness',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Leonidas Trainer',
    date: 'June 1, 2025'
  },
  {
    id: '3',
    title: 'The Mediterranean Diet: Eating Like the Ancients',
    excerpt: 'Discover the health benefits of traditional Greek cuisine and how to incorporate it into your diet.',
    category: 'Diet',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Hippocrates Health',
    date: 'June 10, 2025'
  },
]

export default function IntelligencePage() {
  const [hoveredSection, setHoveredSection] = useState<'wisdom' | 'knowledge' | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Cultivate Your Greek Mindset</h1>
        <p className="text-xl md:text-2xl text-gray-400 text-center mb-12">
          Immerse yourself in the wisdom of ancient Greece and expand your intellectual horizons
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Wisdom Section */}
          <motion.div
            className="relative bg-black/40 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredSection('wisdom')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <Image
              src="/placeholder.svg?height=250&width=250&text=🧠"
              alt="Greek Wisdom"
              width={250}
              height={250}
              className="mb-4"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Explore Greek Wisdom</h2>
            <p className="text-sm md:text-base text-gray-300 text-center mb-4">
              Discover the timeless teachings of ancient Greek philosophers and thinkers
            </p>
            <Button 
              variant="outline" 
              className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
              asChild
            >
              <Link href="/intelligence/1">Start Your Wisdom Journey</Link>
            </Button>
          </motion.div>

          {/* Knowledge Section */}
          <motion.div
            className="relative bg-black/40 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredSection('knowledge')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <Image
              src="/placeholder.svg?height=250&width=250&text=📚"
              alt="Greek Knowledge"
              width={250}
              height={250}
              className="mb-4"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Expand Your Knowledge</h2>
            <p className="text-sm md:text-base text-gray-300 text-center mb-4">
              Dive deep into articles covering various aspects of ancient Greek culture and thought
            </p>
            <Button 
              variant="outline" 
              className="bg-green-600 text-white border-green-500 hover:bg-green-700"
            >
              Explore Articles
            </Button>
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>

        <div className="text-center">
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 px-8"
            asChild
          >
            <Link href="/intelligence/1">Take the Greek Wisdom Questionnaire</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

