// src/components/shop/cart.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { SquarePayment } from '@/components/shop/square-payment';
import { useAuth } from '@/hooks/use-auth';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems,
    clearCart 
  } = useCart();
  
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'greek10') {
      setDiscount(0.1);
    } else if (promoCode.toLowerCase() === 'wisdom20') {
      setDiscount(0.2);
    } else {
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to proceed with checkout');
      return;
    }

    // Generate order ID
    const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderId(newOrderId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    setIsProcessingOrder(true);
    
    try {
      // Save order to database
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: finalTotal,
          paymentId: paymentResult.id,
          status: 'completed',
          userId: user?.uid || null,
          customerEmail: user?.email || '',
          customerName: user?.name || '',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear cart and close
        clearCart();
        setShowPayment(false);
        setDiscount(0);
        setPromoCode('');
        onClose();
        
        // Show success message
        alert(`Payment successful! Your order #${orderId} has been placed. Check your email for confirmation.`);
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert(`Order creation failed: ${error.message}. Please contact support with payment ID: ${paymentResult.id}`);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setOrderId('');
  };

  const subtotal = getTotalPrice();
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const finalTotal = total + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-stone-900">
                  Shopping Cart ({getTotalItems()})
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {showPayment ? (
                <div className="p-6">
                  <SquarePayment
                    amount={finalTotal}
                    orderId={orderId}
                    customerEmail={user?.email || ''}
                    customerName={user?.name || ''}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={handlePaymentCancel}
                  />
                  {isProcessingOrder && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto mb-2"></div>
                      <p className="text-sm text-amber-800">Creating your order...</p>
                    </div>
                  )}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Add some products to get started
                  </p>
                  <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-stone-50 rounded-lg p-4 border border-stone-200"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-stone-200 rounded-md flex-shrink-0 flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-stone-400" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-stone-900 line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-stone-600 mb-2">
                            ${item.price.toFixed(2)} each
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-stone-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && !showPayment && (
              <div className="border-t border-stone-200 p-6 space-y-4">
                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      className="px-4"
                    >
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600">
                      Promo code applied! {(discount * 100).toFixed(0)}% off
                    </p>
                  )}
                  <div className="text-xs text-stone-500">
                    Try codes: GREEK10 or WISDOM20
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({(discount * 100).toFixed(0)}% off)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-stone-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-xs text-stone-500">
                      Free shipping on orders over $50
                    </p>
                  )}
                  
                  <div className="border-t border-stone-200 pt-2 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !user}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300"
                >
                  {!user ? (
                    <span>Please Login to Checkout</span>
                  ) : isCheckingOut ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Payment</span>
                    </div>
                  )}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-stone-500">
                    You need to log in to complete your purchase
                  </p>
                )}

                {/* Additional Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 border-red-200"
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="text-center text-xs text-stone-500 space-y-1">
                  <div className="flex items-center justify-center space-x-4">
                    <span>🔒 Secure Checkout</span>
                    <span>📦 Fast Shipping</span>
                    <span>↩️ Easy Returns</span>
                  </div>
                  <p>Powered by Ancient Greek Wisdom & Modern Technology</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}