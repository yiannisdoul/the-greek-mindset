// src/app/pages/about/page.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { CartProvider } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { useDynamicContent } from '@/hooks/use-dynamic-content'
import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Dumbbell,
  Quote,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const { getContent, loading: contentLoading } = useDynamicContent('about');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  const values = [
    {
      icon: Heart,
      title: "Holistic Development",
      description: "We believe in the ancient Greek ideal of developing both mind and body in harmony, creating complete individuals."
    },
    {
      icon: BookOpen,
      title: "Ancient Wisdom",
      description: "Drawing from millennia of Greek philosophical and physical traditions to provide timeless guidance for modern life."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Building a supportive community of learners and practitioners who share the Greek mindset of continuous improvement."
    },
    {
      icon: Target,
      title: "Practical Application",
      description: "Making ancient wisdom accessible and applicable to contemporary challenges and lifestyle needs."
    }
  ]

  const achievements = [
    { number: "10,000+", label: "Active Members" },
    { number: "500+", label: "Workout Programs" },
    { number: "1,000+", label: "Philosophy Articles" },
    { number: "50+", label: "Expert Contributors" }
  ]

  const teamImages = [
    {
      id: 1,
      title: "Ancient Greek Gymnasium",
      description: "Traditional training grounds that inspired our fitness philosophy",
      category: "Historical Context"
    },
    {
      id: 2,
      title: "Academy of Athens",
      description: "The birthplace of Western philosophy and our intellectual foundation",
      category: "Philosophy"
    },
    {
      id: 3,
      title: "Olympic Games Origins",
      description: "The ancient competitions that shaped our approach to physical excellence",
      category: "Athletic Heritage"
    },
    {
      id: 4,
      title: "Parthenon Architecture",
      description: "Symbol of Greek achievement and the golden ratio in design",
      category: "Cultural Legacy"
    }
  ]

  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0">
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-greek-blue mb-6">
                {getContent('about.hero.title', 'About The Greek Mindset')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
                {getContent('about.hero.subtitle', 'Bridging ancient wisdom with modern living through the timeless principles of Greek philosophy and physical culture.')}
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getContent('about.hero.description', 'We are dedicated to bringing the profound insights of ancient Greece into contemporary life, helping individuals achieve the classical ideal of a sound mind in a sound body.')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="px-6 py-16 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-greek-blue mb-6">
                  {getContent('about.story.title', 'Our Story')}
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    {getContent('about.story.paragraph1', 'The Greek Mindset was born from a profound appreciation for the holistic approach to human development that characterized ancient Greek civilization. In a world increasingly divided between mental and physical pursuits, we saw the need to return to the classical ideal of balanced growth.')}
                  </p>
                  <p>
                    {getContent('about.story.paragraph2', 'Our journey began with a simple observation: the ancient Greeks achieved unprecedented heights in philosophy, art, science, and athletics not despite their integrated approach, but because of it. They understood that true excellence comes from the harmony between intellectual rigor and physical discipline.')}
                  </p>
                  <p>
                    {getContent('about.story.paragraph3', 'Today, we continue this tradition by making ancient wisdom accessible to modern seekers. Through carefully curated content, practical exercises, and a supportive community, we help individuals embark on their own journey toward holistic excellence.')}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild className="bg-greek-gold hover:bg-greek-gold/90">
                    <Link href="/mind">
                      Explore Philosophy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/body">
                      Start Training
                      <Dumbbell className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <div className="bg-gradient-to-br from-greek-gold/20 to-greek-blue/20 rounded-xl p-8 backdrop-blur-sm">
                  <Quote className="h-12 w-12 text-greek-gold mb-4" />
                  <blockquote className="text-xl font-medium text-gray-800 mb-4">
                    "The unexamined life is not worth living, and the untrained body cannot support 
                    the examined mind."
                  </blockquote>
                  <cite className="text-greek-blue font-semibold">— Inspired by Socrates</cite>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Founder Biography Section */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-greek-blue mb-4">
                Meet Our Founder
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dedicated to reviving the ancient Greek approach to human excellence
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200"
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-greek-gold/20 to-greek-blue/20 rounded-full flex items-center justify-center mb-6">
                    <div className="w-40 h-40 bg-greek-gold rounded-full flex items-center justify-center">
                      <span className="text-4xl text-white font-bold">Founder</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-greek-blue mb-2">Dr. Alexandra Kostas</h3>
                  <p className="text-greek-gold font-medium">Founder & Philosophy Director</p>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Dr. Alexandra Kostas holds a Ph.D. in Classical Studies from Oxford University 
                      and has spent over 15 years researching the intersection of ancient Greek 
                      philosophy and modern wellness practices. Her academic journey began with a 
                      fascination for how the Greeks achieved such remarkable heights across multiple 
                      domains of human excellence.
                    </p>
                    <p>
                      As a competitive athlete in her youth and later a philosophy professor, 
                      Alexandra experienced firsthand the power of integrating physical and mental 
                      discipline. This personal transformation led her to develop The Greek Mindset 
                      methodology, which has now helped thousands of individuals worldwide.
                    </p>
                    <p>
                      When not writing or teaching, Alexandra can be found practicing the very 
                      principles she advocates—whether it's a morning run through the hills of 
                      Athens or an evening spent in philosophical contemplation with her community 
                      of fellow seekers.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Classical Studies</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Wellness Research</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Philosophy</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Athletic Training</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="px-6 py-16 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-greek-blue mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at The Greek Mindset
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-greek-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-greek-blue mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-greek-blue mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Building a global community united by the pursuit of excellence
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200"
                >
                  <div className="text-4xl font-bold text-greek-gold mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="px-6 py-16 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-greek-blue mb-4">
                Our Inspiration
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Drawing from the rich heritage of ancient Greek civilization
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {teamImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-marble-200 hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-greek-gold/20 to-greek-blue/20 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <Globe className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">[{image.title} Image]</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-greek-gold/20 text-greek-gold text-xs rounded-full">
                        {image.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-greek-blue mb-2">
                      {image.title}
                    </h3>
                    <p className="text-gray-700">
                      {image.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-greek-blue to-greek-gold rounded-xl p-12 text-white text-center"
            >
              <Lightbulb className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                To empower individuals worldwide with the timeless wisdom of ancient Greece, 
                fostering the development of both mind and body through authentic philosophical 
                teachings and practical physical training that leads to a life of excellence, 
                virtue, and fulfillment.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Authentic Teachings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Practical Application</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Holistic Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Global Community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="px-6 py-16 bg-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-greek-blue mb-6">
                {getContent('about.mission.title', 'Join Our Community')}
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {getContent('about.mission.description', 'Ready to embark on your journey toward holistic excellence? Join thousands of others who have discovered the transformative power of the Greek mindset.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-greek-gold hover:bg-greek-gold/90">
                  <Link href="/auth/signup">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/community">
                    <Users className="mr-2 h-5 w-5" />
                    Explore Community
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}