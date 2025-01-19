'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'

const formSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender.",
  }),
  age: z.number().min(18, {
    message: "You must be at least 18 years old.",
  }).max(120, {
    message: "Please enter a valid age.",
  }),
  goal: z.enum(["lose_weight", "gain_muscle", "get_fit"], {
    required_error: "Please select your primary goal.",
  }),
  activityLevel: z.enum(["sedentary", "light", "moderate", "very_active"], {
    required_error: "Please select your activity level.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const steps = [
  { title: "Gender", field: "gender" },
  { title: "Age", field: "age" },
  { title: "Goal", field: "goal" },
  { title: "Activity Level", field: "activityLevel" },
  { title: "Personal Info", field: "personalInfo" },
]

export default function ContactPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: undefined,
      age: undefined,
      goal: undefined,
      activityLevel: undefined,
      name: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the form data to your backend
    alert("Form submitted successfully!")
  }

  const currentStepData = steps[currentStep]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      form.handleSubmit(onSubmit)()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Start Your Greek Mindset Journey</h1>
      <Progress value={(currentStep / (steps.length - 1)) * 100} className="mb-8" />
      <div className="bg-white shadow-xl rounded-lg p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentStepData.field === "gender" && (
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl font-bold">Select your gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStepData.field === "age" && (
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-bold">What&apos;s your age?</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="text-xl p-6" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStepData.field === "goal" && (
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl font-bold">What&apos;s your primary goal?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="lose_weight" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Lose Weight</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="gain_muscle" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Gain Muscle</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="get_fit" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Get Fit</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStepData.field === "activityLevel" && (
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl font-bold">What&apos;s your activity level?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sedentary" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Sedentary</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="light" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Light Activity</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="moderate" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Moderate Activity</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="very_active" />
                          </FormControl>
                          <FormLabel className="font-normal text-xl">Very Active</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStepData.field === "personalInfo" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-bold">Your Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="text-xl p-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-bold">Your Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="text-xl p-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button type="button" onClick={prevStep} className="text-xl py-6 px-8">
                  Previous
                </Button>
              )}
              <Button type="button" onClick={nextStep} className="text-xl py-6 px-8 ml-auto">
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

