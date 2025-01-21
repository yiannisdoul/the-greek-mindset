"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { X } from "lucide-react"

export default function CartPage() {
  const { cartItems, removeFromCart, getCartTotal } = useCart()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[100vw] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <div className="mt-8">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" onClick={() => removeFromCart(item.id)}>
                    <X className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-between items-center">
              <p className="text-xl font-bold">Total: ${getCartTotal().toFixed(2)}</p>
              <Button>Proceed to Checkout</Button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

