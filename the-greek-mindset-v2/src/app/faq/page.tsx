'use client'

import React from 'react'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { CartProvider } from '@/hooks/use-cart'
import { useDynamicContent } from '@/hooks/use-dynamic-content'
import { useFAQItems } from '@/hooks/use-faq-items'
import { 
  MessageCircle, 
  Mail, 
  Book,
  Dumbbell,
  ChefHat,
  ShoppingCart,
  User,
  HelpCircle,
  Users
} from 'lucide-react'

// Category icon mapping
const categoryIcons: { [key: string]: any } = {
  'Philosophy': Book,
  'Fitness': Dumbbell,
  'Cooking': ChefHat,
  'Platform': User,
  'General': HelpCircle,
  'Account & Shop': ShoppingCart
};

export default function FAQPage() {
  const { getContent, loading: contentLoading } = useDynamicContent('faq');
  const { faqsByCategory, loading: faqLoading, error } = useFAQItems();

  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-greek-blue mb-6">
              {getContent('faq.hero.title', 'Frequently Asked Questions')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              {getContent('faq.hero.subtitle', 'Find answers to common questions about The Greek Mindset')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {getContent('faq.hero.description', 'Get quick answers to your questions about our philosophy courses, fitness programs, recipes, and more. If you cannot find what you are looking for, feel free to contact us.')}
            </p>
          </div>

          {/* FAQ Sections */}
          {faqLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greek-blue"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <p className="text-red-600">Error loading FAQ items: {error}</p>
            </div>
          ) : Object.keys(faqsByCategory).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(faqsByCategory).map(([category, faqs]) => {
                const IconComponent = categoryIcons[category] || HelpCircle;
                return (
                  <section key={category} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-greek-gold/20">
                    <div className="flex items-center gap-3 mb-8">
                      <IconComponent className="h-8 w-8 text-greek-gold" />
                      <h2 className="text-2xl font-bold text-greek-blue">{category}</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <h3 className="text-lg font-semibold text-greek-blue mb-3">
                            {faq.question}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQ Items Available</h3>
              <p className="text-gray-600">FAQ items will appear here once they are added by the administrators.</p>
            </div>
          )}

          {/* Contact Support Section */}
          <div className="mt-16 bg-gradient-to-r from-greek-blue to-greek-gold rounded-xl shadow-lg p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">{getContent('faq.contact.title', 'Still have questions?')}</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                {getContent('faq.contact.description', 'Our support team is here to help you make the most of your Greek Mindset journey. Reach out through any of these channels.')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <MessageCircle className="h-8 w-8 mx-auto mb-3 text-white/80" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-white/80 mb-4">
                  Get instant help from our support team
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <Mail className="h-8 w-8 mx-auto mb-3 text-white/80" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-white/80 mb-4">
                  Detailed responses within 24 hours
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <Users className="h-8 w-8 mx-auto mb-3 text-white/80" />
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-white/80 mb-4">
                  Connect with other Greek Mindset members
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}