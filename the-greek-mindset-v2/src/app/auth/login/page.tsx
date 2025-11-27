// src/app/pages/auth/login/page.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        // Check if there's a redirect URL stored
        const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin')
        if (redirectAfterLogin) {
          sessionStorage.removeItem('redirectAfterLogin')
          router.push(redirectAfterLogin)
        } else {
          router.push('/profile')
        }
      } else {
        setError('email', { message: 'Invalid email or password. Please check your credentials.' })
      }
    } catch (error: any) {
      // Handle specific Firebase Auth errors
      let errorMessage = 'Login failed. Please try again.'
      
      if (error?.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.'
            break
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.'
            break
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.'
            break
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.'
            break
          default:
            errorMessage = 'Login failed. Please check your credentials.'
        }
      }
      
      setError('email', { message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen marble-texture flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-greek-blue hover:text-greek-gold mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-greek-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">ΘΜ</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-greek-blue mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your Greek journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-greek-gold" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-greek-blue hover:text-greek-gold">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-greek-gold hover:bg-greek-gold/90 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-greek-blue hover:text-greek-gold font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600 text-center">
              Email: demo@example.com<br />
              Password: password123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
