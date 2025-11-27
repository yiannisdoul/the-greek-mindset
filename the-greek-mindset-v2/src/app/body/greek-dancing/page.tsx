'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Play, 
  Music,
  Users,
  Search,
  MapPin,
  Calendar,
  Lightbulb,
  Target,
  Clock,
  Heart,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { CartProvider } from '@/hooks/use-cart'
import { useGreekDancing } from '@/hooks/use-greek-dancing'
import { DanceItem } from '@/types/admin'

// Dance type mapping for display colors
const danceTypeColors = {
  traditional: 'bg-blue-100 text-blue-800',
  folk: 'bg-green-100 text-green-800',
  ceremonial: 'bg-purple-100 text-purple-800',
  festive: 'bg-yellow-100 text-yellow-800',
  wedding: 'bg-pink-100 text-pink-800',
  religious: 'bg-red-100 text-red-800',
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

export default function GreekDancingPage() {
  const [selectedDance, setSelectedDance] = useState<DanceItem | null>(null)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { items: dances, loading } = useGreekDancing()

  // Filter dances based on current filters
  const filteredDances = dances.filter(dance => {
    const matchesType = selectedType === 'all' || dance.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || dance.difficulty === selectedDifficulty
    const matchesSearch = dance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dance.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dance.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesDifficulty && matchesSearch
  })

  const featuredDances = dances.filter(dance => dance.featured)
  const dancesByType = dances.reduce((acc, dance) => {
    acc[dance.type] = (acc[dance.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleDanceSelect = (dance: DanceItem) => {
    setSelectedDance(dance)
  }

  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/body" className="inline-flex items-center text-greek-blue hover:text-greek-gold transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Body Training
            </Link>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-greek-blue mb-6">
              Greek Dancing
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Discover the rich tradition of Greek dance - from ancient ceremonial movements to vibrant folk celebrations.
            </p>
          </motion.div>

          {/* Statistics */}
          {!loading && dances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Music className="h-8 w-8 text-greek-blue mb-2" />
                  <div className="text-3xl font-bold text-greek-blue">{dances.length}</div>
                  <div className="text-gray-600 text-sm">Traditional Dances</div>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-8 w-8 text-greek-gold mb-2" />
                  <div className="text-3xl font-bold text-greek-gold">{Object.keys(dancesByType).length}</div>
                  <div className="text-gray-600 text-sm">Dance Types</div>
                </div>
                <div className="flex flex-col items-center">
                  <Play className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    {dances.filter(d => d.demoUrl).length}
                  </div>
                  <div className="text-gray-600 text-sm">With Video Demos</div>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="h-8 w-8 text-greek-gold mb-2" />
                  <div className="text-3xl font-bold text-greek-gold">{featuredDances.length}</div>
                  <div className="text-gray-600 text-sm">Featured Dances</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search dances, regions, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-greek-gold/30 rounded-md focus:ring-2 focus:ring-greek-gold focus:border-greek-gold"
              >
                <option value="all">All Types</option>
                <option value="traditional">Traditional</option>
                <option value="folk">Folk</option>
                <option value="ceremonial">Ceremonial</option>
                <option value="festive">Festive</option>
                <option value="wedding">Wedding</option>
                <option value="religious">Religious</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-greek-gold/30 rounded-md focus:ring-2 focus:ring-greek-gold focus:border-greek-gold"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greek-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading traditional Greek dances...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && dances.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-greek-gold/20"
            >
              <Music className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-greek-blue mb-4">No Dances Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                It looks like no Greek dances have been added to the system yet. 
                Contact the administrator to add dance content.
              </p>
              <Link href="/body">
                <Button variant="outline" className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Body Section
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Featured Dances */}
          {!loading && featuredDances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-greek-blue mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-greek-gold" />
                Featured Dances
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDances.slice(0, 6).map((dance) => (
                  <motion.div
                    key={dance.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-greek-gold/20"
                    onClick={() => handleDanceSelect(dance)}
                  >
                    {dance.imageUrl && (
                      <div className="relative">
                        <img 
                          src={dance.imageUrl} 
                          alt={dance.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{dance.name}</h3>
                        <Badge className={difficultyColors[dance.difficulty]}>
                          {dance.difficulty.charAt(0).toUpperCase() + dance.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{dance.origin}</span>
                        <Badge className={`ml-2 ${danceTypeColors[dance.type]}`}>
                          {dance.type.charAt(0).toUpperCase() + dance.type.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {dance.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Music className="h-4 w-4" />
                          <span className="line-clamp-1">{dance.music}</span>
                        </div>
                        {dance.demoUrl && (
                          <Button size="sm" variant="outline" className="shrink-0">
                            <Play className="h-3 w-3 mr-1" />
                            Demo
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Dances Grid */}
          {!loading && filteredDances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-greek-blue mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Music className="h-6 w-6 text-greek-blue" />
                  {searchQuery || selectedType !== 'all' || selectedDifficulty !== 'all' 
                    ? `Filtered Results (${filteredDances.length})` 
                    : 'All Traditional Dances'
                  }
                </span>
                {filteredDances.length > 6 && (
                  <span className="text-sm font-normal text-gray-500">
                    {filteredDances.length} dances available
                  </span>
                )}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDances.map((dance, index) => (
                  <motion.div
                    key={dance.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-greek-gold/20"
                    onClick={() => handleDanceSelect(dance)}
                  >
                    {dance.imageUrl && (
                      <img 
                        src={dance.imageUrl} 
                        alt={dance.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{dance.name}</h3>
                        <Badge className={difficultyColors[dance.difficulty]}>
                          {dance.difficulty.charAt(0).toUpperCase() + dance.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{dance.origin}</span>
                        <Badge className={`ml-2 ${danceTypeColors[dance.type]}`}>
                          {dance.type.charAt(0).toUpperCase() + dance.type.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {dance.description}
                      </p>

                      {dance.occasions && dance.occasions.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">
                            {dance.occasions.slice(0, 2).join(', ')}
                            {dance.occasions.length > 2 && '...'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Music className="h-4 w-4" />
                          <span className="line-clamp-1">{dance.music}</span>
                        </div>
                        {dance.demoUrl && (
                          <Button size="sm" variant="outline" className="shrink-0">
                            <Play className="h-3 w-3 mr-1" />
                            Demo
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && filteredDances.length === 0 && dances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="h-16 w-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Dances Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to find the dances you're looking for.
              </p>
              <Button
                variant="outline"
                className="border-greek-gold text-greek-blue hover:bg-greek-gold/10"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedType('all')
                  setSelectedDifficulty('all')
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>

        {/* Dance Detail Modal */}
        {selectedDance && (
          <Dialog open={!!selectedDance} onOpenChange={() => setSelectedDance(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-greek-blue flex items-center gap-2">
                  <Music className="h-6 w-6" />
                  {selectedDance.name}
                  {selectedDance.featured && (
                    <Badge className="ml-2 bg-greek-gold text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedDance.imageUrl && (
                  <img 
                    src={selectedDance.imageUrl} 
                    alt={selectedDance.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Origin & Type</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{selectedDance.origin}</span>
                    </div>
                    <Badge className={danceTypeColors[selectedDance.type]}>
                      {selectedDance.type.charAt(0).toUpperCase() + selectedDance.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Difficulty & Music</h4>
                    <Badge className={difficultyColors[selectedDance.difficulty]}>
                      {selectedDance.difficulty.charAt(0).toUpperCase() + selectedDance.difficulty.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{selectedDance.music}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedDance.description}</p>
                </div>

                {selectedDance.history && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Historical Background</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedDance.history}</p>
                  </div>
                )}

                {selectedDance.occasions && selectedDance.occasions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Traditional Occasions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDance.occasions.map((occasion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {occasion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDance.steps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Basic Dance Steps</h4>
                    <ol className="list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-lg">
                      {selectedDance.steps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {selectedDance.instructions && selectedDance.instructions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">How to Perform</h4>
                    <ul className="list-disc list-inside space-y-1 bg-greek-blue/5 p-4 rounded-lg">
                      {selectedDance.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDance.tips && selectedDance.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-greek-gold" />
                      Dancing Tips
                    </h4>
                    <ul className="list-disc list-inside space-y-1 bg-greek-gold/5 p-4 rounded-lg">
                      {selectedDance.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDance.costumes && selectedDance.costumes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Traditional Costumes</h4>
                    <ul className="list-disc list-inside space-y-1 bg-greek-blue/5 p-4 rounded-lg">
                      {selectedDance.costumes.map((costume, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {costume}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDance.instruments && selectedDance.instruments.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Traditional Instruments</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDance.instruments.map((instrument, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50">
                          <Music className="h-3 w-3 mr-1" />
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDance.benefits && selectedDance.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Benefits of Dancing
                    </h4>
                    <ul className="list-disc list-inside space-y-1 bg-red-50 p-4 rounded-lg">
                      {selectedDance.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  {selectedDance.demoUrl && (
                    <Button 
                      className="bg-greek-blue hover:bg-greek-blue/90"
                      onClick={() => window.open(selectedDance.demoUrl, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Demo Video
                    </Button>
                  )}
                  <Button variant="outline" className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                    <Users className="h-4 w-4 mr-2" />
                    Add to Learning Plan
                  </Button>
                  <Button variant="outline" className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                    <Heart className="h-4 w-4 mr-2" />
                    Save to Favorites
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
