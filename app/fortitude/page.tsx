"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"

const articles = [
  {
    id: "1",
    title: "The Spartan Workout: Build Strength Like a Warrior",
    excerpt: "Discover the intense training regimen inspired by ancient Spartan warriors.",
    category: "Workout",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Spartan+Workout",
    author: "Leonidas Trainer",
    date: "July 1, 2025",
  },
  {
    id: "2",
    title: "Mediterranean Diet: Eat Like a Greek God",
    excerpt: "Learn about the health benefits of the traditional Mediterranean diet.",
    category: "Diet",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Mediterranean+Diet",
    author: "Athena Nutritionist",
    date: "July 15, 2025",
  },
  {
    id: "3",
    title: "Olympic Athlete Training Techniques",
    excerpt: "Incorporate ancient Greek athletic training methods into your modern workout routine.",
    category: "Workout",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Olympic+Training",
    author: "Heracles Fitness",
    date: "August 1, 2025",
  },
]

export default function FortitudePage() {
  const [hoveredSection, setHoveredSection] = useState<"workout" | "diet" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Forge Your Spartan Physique</h1>
        <p className="text-xl md:text-2xl text-gray-400 text-center mb-12">
          Embrace the strength and discipline of ancient Greek warriors
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Workout Section */}
          <motion.div
            className="relative bg-black/40 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredSection("workout")}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <Image
              src="/placeholder.svg?height=250&width=250&text=💪"
              alt="Greek Workout"
              width={250}
              height={250}
              className="mb-4"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Spartan Workout Plan</h2>
            <p className="text-sm md:text-base text-gray-300 text-center mb-4">
              Discover your perfect training regimen inspired by ancient Greek warriors
            </p>
            <Button variant="outline" className="bg-red-600 text-white border-red-500 hover:bg-red-700" asChild>
              <Link href="/fortitude/1">Start Your Fortitude Journey</Link>
            </Button>
          </motion.div>

          {/* Diet Section */}
          <motion.div
            className="relative bg-black/40 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredSection("diet")}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <Image
              src="/placeholder.svg?height=250&width=250&text=🍎"
              alt="Greek Diet"
              width={250}
              height={250}
              className="mb-4"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Mediterranean Diet Wisdom</h2>
            <p className="text-sm md:text-base text-gray-300 text-center mb-4">
              Learn the nutritional secrets of the ancient Greeks for optimal health and performance
            </p>
            <Button variant="outline" className="bg-green-600 text-white border-green-500 hover:bg-green-700">
              Explore Diet Resources
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
          <Button className="bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 px-8" asChild>
            <Link href="/fortitude/1">Take the Spartan Fitness Assessment</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

