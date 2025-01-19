'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm fixed w-full z-50 top-0 left-0 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/dark-logo.jpeg"
              alt="The Greek Mindset"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-white font-bold text-xl">The Greek Mindset</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/articles" 
              className={`text-gray-300 hover:text-white px-3 py-2 ${
                pathname === '/articles' ? 'text-white font-semibold' : ''
              }`}
            >
              Articles
            </Link>
            <Link 
              href="/workout-plan" 
              className={`text-gray-300 hover:text-white px-3 py-2 ${
                pathname === '/workout-plan' ? 'text-white font-semibold' : ''
              }`}
            >
              Workout Plan
            </Link>
            <Link 
              href="/about" 
              className={`text-gray-300 hover:text-white px-3 py-2 ${
                pathname === '/about' ? 'text-white font-semibold' : ''
              }`}
            >
              About
            </Link>
            <Link 
              href="/shop" 
              className={`text-gray-300 hover:text-white px-3 py-2 ${
                pathname === '/shop' ? 'text-white font-semibold' : ''
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/contact" 
              className={`text-gray-300 hover:text-white px-3 py-2 ${
                pathname === '/contact' ? 'text-white font-semibold' : ''
              }`}
            >
              Contact
            </Link>
            <Button variant="ghost" size="icon" className="text-gray-300">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

