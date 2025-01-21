'use client'

import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Your Perfect Program Is Ready!</h1>
          <p className="text-xl text-gray-400 mb-8">
            Based on your answers, we've crafted a personalized training program to help you achieve your fitness goals.
          </p>

          <div className="bg-gray-900 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Program Highlights:</h2>
            <ul className="text-left space-y-4 mb-6">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-orange-600 rounded-full mr-3"></span>
                Customized workout intensity
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-orange-600 rounded-full mr-3"></span>
                Nutrition recommendations
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-orange-600 rounded-full mr-3"></span>
                Progress tracking
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-orange-600 rounded-full mr-3"></span>
                Video exercise guides
              </li>
            </ul>
          </div>

          <Button 
            asChild
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
          >
            <Link href="/shop">
              Get Your Program Now
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

