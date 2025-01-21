'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from 'lucide-react'

const branches = [
  {
    id: 'history',
    title: 'Ancient Greek History',
    description: 'Explore the events and figures that shaped ancient Greece',
    icon: '🏛️'
  },
  {
    id: 'mythology',
    title: 'Greek Mythology',
    description: 'Dive into the world of gods, heroes, and mythical creatures',
    icon: '⚡'
  },
  {
    id: 'philosophy',
    title: 'Ancient Greek Philosophy',
    description: 'Uncover the wisdom of great thinkers and their ideas',
    icon: '🧠'
  }
]

const questions = {
  history: [
    {
      question: "Which period is known as the 'Golden Age' of ancient Greece?",
      options: [
        { value: "archaic", label: "Archaic Period" },
        { value: "classical", label: "Classical Period" },
        { value: "hellenistic", label: "Hellenistic Period" },
        { value: "roman", label: "Roman Period" }
      ]
    },
    {
      question: "Who was the Athenian statesman credited with introducing democracy?",
      options: [
        { value: "solon", label: "Solon" },
        { value: "cleisthenes", label: "Cleisthenes" },
        { value: "pericles", label: "Pericles" },
        { value: "draco", label: "Draco" }
      ]
    },
    {
      question: "Which battle marked the end of the Persian invasion of Greece in 480 BC?",
      options: [
        { value: "marathon", label: "Battle of Marathon" },
        { value: "thermopylae", label: "Battle of Thermopylae" },
        { value: "salamis", label: "Battle of Salamis" },
        { value: "plataea", label: "Battle of Plataea" }
      ]
    }
  ],
  mythology: [
    {
      question: "Who is the king of the Greek gods?",
      options: [
        { value: "zeus", label: "Zeus" },
        { value: "poseidon", label: "Poseidon" },
        { value: "hades", label: "Hades" },
        { value: "apollo", label: "Apollo" }
      ]
    },
    {
      question: "Which hero is famous for his twelve labors?",
      options: [
        { value: "hercules", label: "Hercules" },
        { value: "achilles", label: "Achilles" },
        { value: "odysseus", label: "Odysseus" },
        { value: "perseus", label: "Perseus" }
      ]
    },
    {
      question: "What was the name of the monster with snake-like hair that could turn people to stone?",
      options: [
        { value: "medusa", label: "Medusa" },
        { value: "hydra", label: "Hydra" },
        { value: "chimera", label: "Chimera" },
        { value: "scylla", label: "Scylla" }
      ]
    }
  ],
  philosophy: [
    {
      question: "Who is often referred to as the 'father of Western philosophy'?",
      options: [
        { value: "socrates", label: "Socrates" },
        { value: "plato", label: "Plato" },
        { value: "aristotle", label: "Aristotle" },
        { value: "thales", label: "Thales" }
      ]
    },
    {
      question: "Which philosophical school was founded by Zeno of Citium?",
      options: [
        { value: "stoicism", label: "Stoicism" },
        { value: "epicureanism", label: "Epicureanism" },
        { value: "cynicism", label: "Cynicism" },
        { value: "skepticism", label: "Skepticism" }
      ]
    },
    {
      question: "What is the Socratic method?",
      options: [
        { value: "questioning", label: "A method of questioning to stimulate critical thinking" },
        { value: "lecturing", label: "A method of lecturing to impart knowledge" },
        { value: "writing", label: "A method of writing philosophical treatises" },
        { value: "debating", label: "A method of formal debate between philosophers" }
      ]
    }
  ]
}

export default function IntelligenceQuestionnaire() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [branch, setBranch] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestions = branch ? questions[branch as keyof typeof questions] : []
  const totalSteps = currentQuestions.length + 1 // +1 for branch selection
  const progress = ((step + 1) / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      // Handle completion (e.g., show results or navigate to a results page)
      router.push('/intelligence/results')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      router.push('/intelligence')
    }
  }

  const handleSelect = (value: string) => {
    if (step === 0) {
      setBranch(value)
    } else {
      setAnswers({ ...answers, [step]: value })
    }
  }

  const isValid = () => {
    if (step === 0) return branch !== null
    return answers[step] !== undefined
  }

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
            {step === 0 ? "Choose Your Path of Wisdom" : currentQuestions[step - 1].question}
          </h2>

          <RadioGroup
            value={step === 0 ? branch || '' : answers[step] || ''}
            onValueChange={handleSelect}
            className="space-y-4"
          >
            {step === 0 ? (
              branches.map((b) => (
                <Label
                  key={b.id}
                  htmlFor={b.id}
                  className="flex items-center p-4 bg-[#1a1d24] rounded-lg cursor-pointer hover:bg-[#272b33] transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <div className="relative flex items-center">
                      <RadioGroupItem
                        value={b.id}
                        id={b.id}
                        className="w-5 h-5 border-2 border-white data-[state=checked]:border-white data-[state=checked]:bg-white"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-xl font-medium text-white">
                        {b.icon} {b.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {b.description}
                      </div>
                    </div>
                  </div>
                </Label>
              ))
            ) : (
              currentQuestions[step - 1].options.map((option) => (
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
                    </div>
                  </div>
                </Label>
              ))
            )}
          </RadioGroup>

          <Button
            onClick={handleNext}
            disabled={!isValid()}
            className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
          >
            {step === totalSteps - 1 ? "Complete Your Journey" : "Continue"}
          </Button>
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Step {step + 1} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  )
}

