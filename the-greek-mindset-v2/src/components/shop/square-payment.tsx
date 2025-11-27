'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Lock, AlertCircle } from 'lucide-react'
import { SQUARE_WEB_SDK_URL, squareConfig } from '@/lib/square-config'

interface SquarePaymentProps {
  amount: number
  orderId: string
  customerEmail: string
  customerName?: string
  onSuccess: (paymentResult: any) => void
  onError: (error: string) => void
  onCancel: () => void
}

// Extend Window interface for Square
declare global {
  interface Window {
    Square: any
  }
}

export function SquarePayment({
  amount,
  orderId,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  onCancel,
}: SquarePaymentProps) {
  const [card, setCard] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSquareLoaded, setIsSquareLoaded] = useState(false)

  useEffect(() => {
    const loadSquare = async () => {
      try {
        setIsInitializing(true)

        // Check if Square is already loaded
        if (window.Square) {
          await initializeCard()
          return
        }

        // Load Square Web SDK
        const script = document.createElement('script')
        script.src = SQUARE_WEB_SDK_URL
        script.async = true
        
        script.onload = async () => {
          await initializeCard()
        }

        script.onerror = () => {
          setError('Failed to load Square payment form. Please refresh and try again.')
          setIsInitializing(false)
        }

        document.body.appendChild(script)
      } catch (err: any) {
        setError(`Initialization error: ${err.message}`)
        setIsInitializing(false)
      }
    }

    const initializeCard = async () => {
      try {
        if (!window.Square) {
          throw new Error('Square.js failed to load')
        }

        // Validate configuration
        if (!squareConfig.applicationId || !squareConfig.locationId) {
          throw new Error('Square is not properly configured. Please contact support.')
        }

        // Initialize payments
        const payments = window.Square.payments(
          squareConfig.applicationId,
          squareConfig.locationId
        )

        // Create and attach card
        const cardInstance = await payments.card()
        await cardInstance.attach('#square-card-container')
        
        setCard(cardInstance)
        setIsSquareLoaded(true)
        setIsInitializing(false)
      } catch (err: any) {
        console.error('Card initialization error:', err)
        setError(`Payment form initialization failed: ${err.message}`)
        setIsInitializing(false)
      }
    }

    loadSquare()

    // Cleanup
    return () => {
      if (card) {
        try {
          card.destroy()
        } catch (err) {
          console.error('Error destroying card:', err)
        }
      }
    }
  }, [])

  const handlePayment = async () => {
    if (!card) {
      setError('Payment form is not ready. Please refresh and try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Tokenize the card
      const result = await card.tokenize()

      if (result.status === 'OK') {
        // Step 2: Send token to server for payment processing
        const response = await fetch('/api/payment/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount,
            orderId,
            customerEmail,
            customerName,
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Payment successful
          onSuccess(data.payment)
        } else {
          throw new Error(data.details || data.error || 'Payment failed')
        }
      } else {
        // Tokenization failed
        const errorMessage = result.errors?.[0]?.message || 'Card information is invalid'
        throw new Error(errorMessage)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment processing failed. Please try again.'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-600" />
              Secure Payment
            </CardTitle>
            <p className="text-sm text-stone-600 mt-1">
              Order #{orderId}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600">
              ${amount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Square Card Form Container */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">
            Card Information
          </label>
          <div 
            id="square-card-container" 
            className="min-h-[200px] p-4 border-2 border-stone-200 rounded-lg bg-white focus-within:border-amber-500 transition-colors"
          />
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-stone-600">Loading payment form...</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-green-800">
            Your payment is secured by Square. We never store your card information.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handlePayment}
            disabled={!isSquareLoaded || isLoading || isInitializing}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 h-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
          <Button
            onClick={onCancel}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-stone-300 hover:bg-stone-50 font-semibold py-3 h-auto"
          >
            Cancel
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pt-2 border-t border-stone-200">
          <p className="text-xs text-stone-500 text-center">
            By completing this payment, you agree to our Terms of Service
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
