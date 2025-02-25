"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchModal } from "./search-modal"
import { AuthModal } from "./auth-modal"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems } = useCart()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/fortitude", label: "Fortitude" },
    { href: "/intelligence", label: "Intelligence" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${mobile ? "text-gray-900" : "text-gray-300 hover:text-white"} px-3 py-2 ${
            pathname === item.href ? "text-white font-semibold" : ""
          }`}
          onClick={() => mobile && setIsOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      <SearchModal />
      <AuthModal />
      <Link href="/cart" className="text-gray-300 hover:text-white relative">
        <ShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </Link>
    </>
  )

  return (
    <nav className="bg-gradient-to-b from-gray-900 to-gray-800 fixed w-full z-50 top-0 left-0 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image src="/images/dark-logo.jpeg" alt="The Greek Mindset" width={40} height={40} className="mr-2" />
            <span className="text-white font-bold text-xl">The Greek Mindset</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

