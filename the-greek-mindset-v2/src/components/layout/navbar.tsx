'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, User, Menu, X, ShoppingCart, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/body', label: 'Body' },
  { href: '/mind', label: 'Mind' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/community', label: 'Community' },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { items } = useCart()

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm shadow-lg z-40 hidden md:flex flex-col">
      {/* Top Section - Logo & Social */}
      <div className="p-6 border-b border-marble-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-2">
            <Facebook className="h-4 w-4 text-greek-blue hover:text-greek-gold cursor-pointer" />
            <Twitter className="h-4 w-4 text-greek-blue hover:text-greek-gold cursor-pointer" />
            <Instagram className="h-4 w-4 text-greek-blue hover:text-greek-gold cursor-pointer" />
          </div>
        </div>
        
        <Link href="/" className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-greek-gold rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">ΘΜ</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-greek-blue">The Greek</h1>
            <h2 className="font-bold text-lg text-greek-blue -mt-1">Mindset</h2>
          </div>
        </Link>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Auth Section */}
        <div className="space-y-2">
          {user ? (
            <div className="space-y-2">
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" onClick={logout} className="w-full justify-start">
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/auth/login">
                <Button className="w-full bg-greek-gold hover:bg-greek-gold/90">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full mt-5">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-greek-gold text-white'
                      : 'text-gray-700 hover:bg-marble-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      
      {/* Cart */}
      <div className="p-4 border-t border-marble-200">
        <Link href="/cart">
          <Button variant="outline" className="w-full justify-start relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-greek-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </nav>
  )
}

// Mobile Navbar for non-Body pages
export function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-greek-gold rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">ΘΜ</span>
          </div>
          <span className="font-bold text-greek-blue">The Greek Mindset</span>
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-t border-marble-200"
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm hover:bg-marble-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}