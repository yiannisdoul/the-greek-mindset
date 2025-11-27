'use client'

import React from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { CartProvider } from '@/hooks/use-cart'
import { useDynamicContent } from '@/hooks/use-dynamic-content'

export default function ContactPage() {
  const { getContent, loading: contentLoading } = useDynamicContent('contact');

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
              {getContent('contact.hero.title', 'Contact Us')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              {getContent('contact.hero.subtitle', 'Get in touch with us for any questions or support')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {getContent('contact.hero.description', 'We\'re here to help you on your journey toward holistic excellence through ancient Greek wisdom.')}
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-greek-gold/20">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-greek-gold mr-3" />
                <h3 className="text-xl font-semibold text-greek-blue">
                  {getContent('contact.info.email.title', 'Email')}
                </h3>
              </div>
              <p className="text-gray-700 mb-2">
                {getContent('contact.info.email.description', 'Send us an email anytime')}
              </p>
              <a 
                href={`mailto:${getContent('contact.info.email.address', 'support@greekmindset.com')}`}
                className="text-greek-blue hover:text-greek-gold font-medium transition-colors"
              >
                {getContent('contact.info.email.address', 'support@greekmindset.com')}
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-greek-gold/20">
              <div className="flex items-center mb-4">
                <Phone className="h-6 w-6 text-greek-gold mr-3" />
                <h3 className="text-xl font-semibold text-greek-blue">
                  {getContent('contact.info.phone.title', 'Phone')}
                </h3>
              </div>
              <p className="text-gray-700 mb-2">
                {getContent('contact.info.phone.description', 'Call us during business hours')}
              </p>
              <a 
                href={`tel:${getContent('contact.info.phone.number', '+1 (234) 567-890').replace(/\s+/g, '')}`}
                className="text-greek-blue hover:text-greek-gold font-medium transition-colors"
              >
                {getContent('contact.info.phone.number', '+1 (234) 567-890')}
              </a>
            </div>

            {/* Address */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-greek-gold/20">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-greek-gold mr-3" />
                <h3 className="text-xl font-semibold text-greek-blue">
                  {getContent('contact.info.address.title', 'Address')}
                </h3>
              </div>
              <p className="text-gray-700" style={{ whiteSpace: 'pre-line' }}>
                {getContent('contact.info.address.details', '123 Wisdom Street\nAthens District\nMindset City, MC 12345')}
              </p>
            </div>

            {/* Business Hours */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-greek-gold/20">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-greek-gold mr-3" />
                <h3 className="text-xl font-semibold text-greek-blue">
                  {getContent('contact.info.hours.title', 'Business Hours')}
                </h3>
              </div>
              <div className="text-gray-700">
                <p>{getContent('contact.info.hours.weekdays', 'Monday - Friday: 9:00 AM - 6:00 PM')}</p>
                <p>{getContent('contact.info.hours.saturday', 'Saturday: 10:00 AM - 4:00 PM')}</p>
                <p>{getContent('contact.info.hours.sunday', 'Sunday: Closed')}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-greek-blue/10 to-greek-gold/10 rounded-xl p-8 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-greek-blue mb-4">
              {getContent('contact.support.title', 'Need Help?')}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {getContent('contact.support.description', 'Our support team is here to help you with any questions about your Greek mindset journey. We typically respond to emails within 24 hours and are committed to guiding you toward holistic excellence.')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}