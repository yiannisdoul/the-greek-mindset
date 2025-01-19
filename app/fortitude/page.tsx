'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const ageGroups = [
  {
    range: "18-29",
    image: "/placeholder.svg?height=400&width=300",
    description: "Age of the Warrior - Peak physical development",
    title: "FORGE YOUR WARRIOR'S PATH"
  },
  {
    range: "30-39",
    image: "/placeholder.svg?height=400&width=300",
    description: "Age of the Hoplite - Mastery of strength",
    title: "MASTER YOUR STRENGTH"
  },
  {
    range: "40-49",
    image: "/placeholder.svg?height=400&width=300",
    description: "Age of the Strategist - Wisdom and power",
    title: "EMBRACE YOUR POWER"
  },
  {
    range: "50+",
    image: "/placeholder.svg?height=400&width=300",
    description: "Age of the Sage - Enduring excellence",
    title: "MAINTAIN YOUR EXCELLENCE"
  }
]

export default function FortitudePage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null)
  const router = useRouter()

  const handleAgeSelect = (ageRange: string) => {
    setSelectedAge(ageRange)
    router.push('/fortitude/1')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            FORGE YOUR SPARTAN PHYSIQUE
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            CHOOSE YOUR PATH TO EXCELLENCE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ageGroups.map((group) => (
            <motion.div
              key={group.range}
              whileHover={{ scale: 1.02 }}
              className="relative cursor-pointer"
              onClick={() => handleAgeSelect(group.range)}
            >
              <div className="relative h-[500px] bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={group.image || "/placeholder.svg"}
                  alt={`Age ${group.range}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">{group.title}</h3>
                    <p className="text-sm text-gray-300 mb-4">{group.description}</p>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                    >
                      Age: {group.range}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            "Sweat more in training, bleed less in battle" - Ancient Spartan Proverb
          </p>
          <p className="mt-2">
            We recommend consulting with your physician before beginning any exercise program
          </p>
        </div>
      </div>
    </div>
  )
}

