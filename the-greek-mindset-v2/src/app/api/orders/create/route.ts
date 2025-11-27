import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

/**
 * POST /api/orders/create
 * 
 * Creates an order in Firestore after successful payment
 * 
 * Body:
 * - orderId: Unique order identifier
 * - items: Array of cart items
 * - total: Total amount paid
 * - paymentId: Square payment ID
 * - status: Order status (e.g., 'completed', 'pending')
 * - userId: Optional user ID
 * - customerEmail: Customer email
 * - customerName: Customer name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      orderId, 
      items, 
      total, 
      paymentId, 
      status = 'completed',
      userId,
      customerEmail,
      customerName,
      shippingAddress,
    } = body

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      )
    }

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Prepare order data
    const orderData = {
      orderId,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null,
        category: item.category || null,
      })),
      total,
      paymentId,
      status,
      userId: userId || null,
      customerEmail: customerEmail || null,
      customerName: customerName || null,
      shippingAddress: shippingAddress || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save order to Firestore
    const ordersRef = collection(db, 'orders')
    const docRef = await addDoc(ordersRef, orderData)

    console.log(`Order created successfully: ${orderId} (Doc ID: ${docRef.id})`)

    return NextResponse.json({
      success: true,
      order: {
        id: docRef.id,
        orderId,
        status,
        total,
      },
    })
  } catch (error: any) {
    console.error('Order creation error:', error)

    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/orders/create
 * 
 * Not implemented - orders should be created via POST
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create orders.' },
    { status: 405 }
  )
}
