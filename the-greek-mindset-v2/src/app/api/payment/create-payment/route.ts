import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { squareConfig, validateSquareConfig } from '@/lib/square-config'

// Dynamic import of Square SDK to avoid CommonJS issues
let SquareClient: any

async function getSquareClient() {
  if (!SquareClient) {
    const square = await import('square')
    SquareClient = square.SquareClient
  }
  
  const validation = validateSquareConfig()
  
  if (!validation.isValid) {
    console.error('Square configuration errors:', validation.errors)
    throw new Error('Square is not properly configured')
  }

  return new SquareClient({
    bearerAuthCredentials: {
      accessToken: squareConfig.accessToken,
    },
    environment: squareConfig.environment,
  })
}

/**
 * POST /api/payment/create-payment
 * 
 * Creates a payment using Square Payments API
 * 
 * Body:
 * - sourceId: Token from Square Web SDK
 * - amount: Amount in dollars (will be converted to cents)
 * - currency: Currency code (default: USD)
 * - customerEmail: Email of the customer
 * - orderId: Reference ID for the order
 * - customerName: Optional customer name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      sourceId, 
      amount, 
      currency = 'USD', 
      customerEmail, 
      orderId,
      customerName 
    } = body

    // Validate required fields
    if (!sourceId) {
      return NextResponse.json(
        { error: 'Payment source token is required' },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Initialize Square client
    const client = await getSquareClient()

    // Convert amount to cents (Square uses the smallest currency unit)
    const amountInCents = Math.round(amount * 100)

    console.log(`Processing payment for order ${orderId}: $${amount}`)

    // Create payment
    const { result } = await client.payments.create({
      sourceId,
      idempotencyKey: randomUUID(), // Prevents duplicate charges
      amountMoney: {
        amount: BigInt(amountInCents),
        currency,
      },
      locationId: squareConfig.locationId,
      referenceId: orderId,
      buyerEmailAddress: customerEmail,
      note: customerName 
        ? `Greek Mindset Order ${orderId} - ${customerName}`
        : `Greek Mindset Order ${orderId}`,
      // Optional: Add autocomplete to complete payment immediately
      autocomplete: true,
    })

    console.log(`Payment successful: ${result.payment?.id}`)

    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment?.id,
        status: result.payment?.status,
        orderId: result.payment?.referenceId,
        amountMoney: result.payment?.amountMoney,
        createdAt: result.payment?.createdAt,
        receiptUrl: result.payment?.receiptUrl,
      },
    })
  } catch (error: any) {
    console.error('Square payment error:', error)

    // Handle specific Square API errors
    if (error.errors) {
      const errorMessages = error.errors.map((e: any) => e.detail || e.message).join(', ')
      return NextResponse.json(
        { 
          error: 'Payment processing failed', 
          details: errorMessages,
          code: error.errors[0]?.code || 'UNKNOWN_ERROR'
        },
        { status: 400 }
      )
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Payment processing failed', 
        details: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/create-payment
 * 
 * Health check endpoint to verify Square configuration
 */
export async function GET() {
  const validation = validateSquareConfig()
  
  return NextResponse.json({
    configured: validation.isValid,
    environment: squareConfig.environment,
    errors: validation.errors,
  })
}
