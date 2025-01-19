'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { use } from 'react'
import { ArrowLeft } from 'lucide-react'

interface StepProps {
  params: Promise<{ step: string }>
}

const questions = [
  {
    step: 1,
    question: "Where will you train like a Spartan warrior?",
    options: [
      { value: "home", label: "Home Palaestra 🏠", description: "Train in your personal space" },
      { value: "gymnasium", label: "Modern Gymnasium 🏛️", description: "Train in a equipped facility" },
      { value: "outdoors", label: "Natural Arena 🌳", description: "Train in nature like ancient warriors" }
    ]
  },
  {
    step: 2,
    question: "Test your strength: How many shield lifts (push-ups) can you perform?",
    options: [
      { value: "beginner", label: "Aspiring Warrior (0-10)" },
      { value: "intermediate", label: "Hoplite Warrior (11-25)" },
      { value: "advanced", label: "Elite Warrior (26-40)" },
      { value: "elite", label: "Spartan Elite (40+)" }
    ]
  },
  {
    step: 3,
    question: "How often do you plan to train like a Spartan?",
    options: [
      { value: "moderate", label: "3 times per week - Warrior's Rhythm" },
      { value: "frequent", label: "4-5 times per week - Elite Training" },
      { value: "intense", label: "6+ times per week - Spartan Dedication" }
    ]
  },
  {
    step: 4,
    question: "Choose your warrior's diet focus:",
    options: [
      { value: "traditional", label: "Traditional Mediterranean 🫒", description: "Olive oil, fish, vegetables" },
      { value: "warrior", label: "Spartan Black Broth Focus 🥘", description: "High protein, moderate carbs" },
      { value: "modern", label: "Modern Warrior 🥗", description: "Balanced Mediterranean approach" }
    ]
  },
  {
    step: 5,
    question: "Select your path to excellence:",
    options: [
      { value: "strength", label: "Strength of Hercules 💪", description: "Focus on pure strength" },
      { value: "endurance", label: "Endurance of Pheidippides 🏃", description: "Focus on stamina" },
      { value: "balanced", label: "Balance of Apollo ⚖️", description: "Equal focus on all aspects" }
    ]
  },
  {
    step: 6,
    question: "Choose your additional Spartan disciplines:",
    type: "checkbox",
    options: [
      { id: "morning", label: "Dawn Training Ritual" },
      { id: "cold", label: "Cold Water Immersion" },
      { id: "meditation", label: "Stoic Meditation" },
      { id: "fasting", label: "Warrior's Fasting" },
      { id: "none", label: "None of the above" }
    ]
  },
  {
    step: 7,
    question: "What's your name, warrior?",
    type: "text",
    placeholder: "Enter your name"
  },
  {
    step: 8,
    question: "When were you born?",
    type: "date",
    placeholder: "DD/MM/YYYY"
  },
  {
    step: 9,
    question: "Your communication scroll (email)",
    type: "email",
    placeholder: "name@example.com"
  }
]

export default function StepPage({ params }: StepProps) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const currentStep = parseInt(unwrappedParams.step)
  const question = questions.find(q => q.step === currentStep)
  const [selected, setSelected] = useState<string | string[]>("")
  const [textValue, setTextValue] = useState("")
  
  const progress = (currentStep / questions.length) * 100

  const handleNext = () => {
    if (currentStep < questions.length) {
      router.push(`/fortitude/${currentStep + 1}`)
    } else {
      router.push('/fortitude/results')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/fortitude/${currentStep - 1}`)
    } else {
      router.push('/fortitude')
    }
  }

  const isValid = () => {
    if (question?.type === "checkbox") {
      return Array.isArray(selected) && selected.length > 0
    }
    if (question?.type === "text" || question?.type === "email" || question?.type === "date") {
      return textValue.length > 0
    }
    return selected !== ""
  }

  if (!question) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <Progress value={progress} className="mb-8" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-4 text-white hover:text-orange-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <h2 className="text-3xl font-bold mb-8 text-center">
            {question.question}
          </h2>

          {question.type === "checkbox" ? (
            <div className="space-y-4">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={Array.isArray(selected) && selected.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(prev => 
                          Array.isArray(prev) ? [...prev, option.id] : [option.id]
                        )
                      } else {
                        setSelected(prev => 
                          Array.isArray(prev) ? prev.filter(id => id !== option.id) : []
                        )
                      }
                    }}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          ) : question.type === "text" || question.type === "email" || question.type === "date" ? (
            <Input
              type={question.type}
              placeholder={question.placeholder}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          ) : (
            <RadioGroup
              value={selected as string}
              onValueChange={setSelected}
              className="space-y-4"
            >
              {question.options?.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-center p-4 bg-[#1a1d24] rounded-lg cursor-pointer hover:bg-[#272b33] transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <div className="relative flex items-center">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="w-5 h-5 border-2 border-white data-[state=checked]:border-white data-[state=checked]:bg-white"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-white">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-400">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}

          <Button
            onClick={handleNext}
            disabled={!isValid()}
            className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
          >
            {currentStep === questions.length ? "Complete Your Journey" : "Continue"}
          </Button>
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Step {currentStep} of {questions.length}
          </p>
        </div>
      </div>
    </div>
  )
}

