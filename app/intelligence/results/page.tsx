'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function IntelligenceResults() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Your Journey of Wisdom is Complete!</h1>
          <p className="text-xl text-gray-400 mb-8">
            You have taken the first steps on the path of Greek wisdom. Continue your journey to unlock the full power of ancient knowledge.
          </p>
          <Button 
            onClick={() => router.push('/intelligence')}
            className="bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 px-8"
          >
            Explore More Greek Wisdom
          </Button>
        </div>
      </div>
    </div>
  )
}

