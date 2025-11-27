import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/use-auth'
import { CartProvider } from '@/hooks/use-cart'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Greek Mindset - Ancient Wisdom for Modern Living',
  description: 'Discover the wisdom and practices of ancient Greece for holistic well-being',
  manifest: '/manifest.json',
  themeColor: '#D4AF37',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#D4AF37" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} antialiased bg-marble-50`}>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-marble relative">
              {/* Marble Background Pattern */}
              <div className="fixed inset-0 bg-marble opacity-20 pointer-events-none" />
              
              {/* Parthenon Column Borders */}
              <div className="fixed left-0 top-0 h-full w-16 bg-gradient-to-r from-marble-200 to-transparent z-0 hidden md:block">
                <div className="h-full w-full opacity-30 bg-repeat-y" style={{
                  backgroundImage: "url('/images/parthenon-column.svg')",
                  backgroundSize: '100% 200px'
                }} />
              </div>
              <div className="fixed right-0 top-0 h-full w-16 bg-gradient-to-l from-marble-200 to-transparent z-0 hidden md:block">
                <div className="h-full w-full opacity-30 bg-repeat-y" style={{
                  backgroundImage: "url('/images/parthenon-column.svg')",
                  backgroundSize: '100% 200px'
                }} />
              </div>
              
              {/* Main Content */}
              <div className="relative z-10 md:px-16">
                {children}
              </div>
            </div>
          </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>

      </body>
    </html>
  )
}