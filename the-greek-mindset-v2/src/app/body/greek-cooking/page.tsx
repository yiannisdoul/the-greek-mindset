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
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Star,
  Search,
  Play,
  BookOpen,
  Utensils,
  Leaf,
  Timer,
  MapPin,
  Calendar,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { CartProvider } from '@/hooks/use-cart'
import { useGreekCooking } from '@/hooks/use-greek-cooking'
import { RecipeItem } from '@/types/admin'

// Category colors for badges
const categoryColors = {
  appetizer: 'bg-orange-100 text-orange-800',
  main: 'bg-red-100 text-red-800',
  dessert: 'bg-pink-100 text-pink-800',
  salad: 'bg-green-100 text-green-800',
  soup: 'bg-yellow-100 text-yellow-800',
  beverage: 'bg-blue-100 text-blue-800',
  bread: 'bg-amber-100 text-amber-800',
  snack: 'bg-purple-100 text-purple-800',
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

export default function GreekCookingPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { items: recipes, loading } = useGreekCooking()

  // Filter recipes based on current filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine === selectedCuisine
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (recipe.region && recipe.region.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesCuisine && matchesDifficulty && matchesSearch
  })

  const featuredRecipes = recipes.filter(recipe => recipe.featured)
  const recipesByCategory = recipes.reduce((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleRecipeSelect = (recipe: RecipeItem) => {
    setSelectedRecipe(recipe)
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
              Greek Cooking
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Nourish your body with authentic Mediterranean recipes that fuel performance and promote longevity.
            </p>
          </motion.div>

          {/* Statistics */}
          {!loading && recipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <ChefHat className="h-8 w-8 text-greek-blue mb-2" />
                  <div className="text-3xl font-bold text-greek-blue">{recipes.length}</div>
                  <div className="text-gray-600 text-sm">Traditional Recipes</div>
                </div>
                <div className="flex flex-col items-center">
                  <Utensils className="h-8 w-8 text-greek-gold mb-2" />
                  <div className="text-3xl font-bold text-greek-gold">{Object.keys(recipesByCategory).length}</div>
                  <div className="text-gray-600 text-sm">Recipe Categories</div>
                </div>
                <div className="flex flex-col items-center">
                  <Play className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    {recipes.filter(r => r.videoUrl).length}
                  </div>
                  <div className="text-gray-600 text-sm">With Video Demos</div>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="h-8 w-8 text-greek-gold mb-2" />
                  <div className="text-3xl font-bold text-greek-gold">{featuredRecipes.length}</div>
                  <div className="text-gray-600 text-sm">Featured Recipes</div>
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
                    placeholder="Search recipes, cuisines, or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-greek-gold/30 rounded-md focus:ring-2 focus:ring-greek-gold focus:border-greek-gold"
              >
                <option value="all">All Categories</option>
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="salad">Salad</option>
                <option value="soup">Soup</option>
                <option value="beverage">Beverage</option>
                <option value="bread">Bread</option>
                <option value="snack">Snack</option>
              </select>

              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-3 py-2 border border-greek-gold/30 rounded-md focus:ring-2 focus:ring-greek-gold focus:border-greek-gold"
              >
                <option value="all">All Cuisines</option>
                <option value="mainland">Mainland</option>
                <option value="islands">Islands</option>
                <option value="crete">Crete</option>
                <option value="cyprus">Cyprus</option>
                <option value="pontian">Pontian</option>
                <option value="constantinople">Constantinople</option>
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
              <p className="text-gray-600">Loading traditional Greek recipes...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && recipes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-greek-gold/20"
            >
              <ChefHat className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-greek-blue mb-4">No Recipes Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                It looks like no Greek recipes have been added to the system yet. 
                Contact the administrator to add recipe content.
              </p>
              <Link href="/body">
                <Button variant="outline" className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Body Section
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Featured Recipes */}
          {!loading && featuredRecipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-greek-blue mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-greek-gold" />
                Featured Recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRecipes.slice(0, 6).map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-greek-gold/20"
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    {recipe.imageUrl && (
                      <div className="relative">
                        <img 
                          src={recipe.imageUrl} 
                          alt={recipe.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-greek-gold text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{recipe.name}</h3>
                        <Badge className={difficultyColors[recipe.difficulty]}>
                          {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{recipe.cuisine}</span>
                        <Badge className={`ml-2 ${categoryColors[recipe.category]}`}>
                          {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {recipe.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            <span>{recipe.totalTime}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>
                        {recipe.videoUrl && (
                          <Button size="sm" variant="outline" className="shrink-0">
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Recipes Grid */}
          {!loading && filteredRecipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-greek-blue mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-greek-blue" />
                  {searchQuery || selectedCategory !== 'all' || selectedCuisine !== 'all' || selectedDifficulty !== 'all' 
                    ? `Filtered Results (${filteredRecipes.length})` 
                    : 'All Traditional Recipes'
                  }
                </span>
                {filteredRecipes.length > 6 && (
                  <span className="text-sm font-normal text-gray-500">
                    {filteredRecipes.length} recipes available
                  </span>
                )}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-greek-gold/20"
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    {recipe.imageUrl && (
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{recipe.name}</h3>
                        <Badge className={difficultyColors[recipe.difficulty]}>
                          {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{recipe.cuisine}</span>
                        <Badge className={`ml-2 ${categoryColors[recipe.category]}`}>
                          {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {recipe.description}
                      </p>

                      {recipe.occasions && recipe.occasions.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">
                            {recipe.occasions.slice(0, 2).join(', ')}
                            {recipe.occasions.length > 2 && '...'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            <span>{recipe.totalTime}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>
                        {recipe.videoUrl && (
                          <Button size="sm" variant="outline" className="shrink-0">
                            <Play className="h-3 w-3 mr-1" />
                            Video
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
          {!loading && filteredRecipes.length === 0 && recipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="h-16 w-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Recipes Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to find the recipes you're looking for.
              </p>
              <Button 
                variant="outline"
                className="border-greek-gold text-greek-blue hover:bg-greek-gold/10"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedCuisine('all')
                  setSelectedDifficulty('all')
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-greek-blue flex items-center gap-2">
                  <ChefHat className="h-6 w-6" />
                  {selectedRecipe.name}
                  {selectedRecipe.featured && (
                    <Badge className="ml-2 bg-greek-gold text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedRecipe.imageUrl && (
                  <img 
                    src={selectedRecipe.imageUrl} 
                    alt={selectedRecipe.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Recipe Details</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{selectedRecipe.cuisine}</span>
                      {selectedRecipe.region && (
                        <Badge variant="outline" className="text-xs">
                          {selectedRecipe.region}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={categoryColors[selectedRecipe.category]}>
                        {selectedRecipe.category.charAt(0).toUpperCase() + selectedRecipe.category.slice(1)}
                      </Badge>
                      <Badge className={difficultyColors[selectedRecipe.difficulty]}>
                        {selectedRecipe.difficulty.charAt(0).toUpperCase() + selectedRecipe.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Cooking Time & Servings</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Prep: {selectedRecipe.prepTime}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <span>Cook: {selectedRecipe.cookTime}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Serves: {selectedRecipe.servings}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedRecipe.description}</p>
                </div>

                {selectedRecipe.historicalBackground && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Historical Background</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedRecipe.historicalBackground}</p>
                  </div>
                )}

                {selectedRecipe.occasions && selectedRecipe.occasions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Traditional Occasions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.occasions.map((occasion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {occasion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecipe.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1 bg-greek-blue/5 p-4 rounded-lg">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-2 bg-greek-blue/5 p-4 rounded-lg">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-greek-gold" />
                      Cooking Tips
                    </h4>
                    <ul className="list-disc list-inside space-y-1 bg-greek-gold/5 p-4 rounded-lg">
                      {selectedRecipe.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRecipe.nutritionalBenefits && selectedRecipe.nutritionalBenefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-greek-blue" />
                      Nutritional Benefits
                    </h4>
                    <ul className="list-disc list-inside space-y-1 bg-greek-blue/5 p-4 rounded-lg">
                      {selectedRecipe.nutritionalBenefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-700 leading-relaxed">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRecipe.dietaryRestrictions && selectedRecipe.dietaryRestrictions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Dietary Information</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.dietaryRestrictions.map((restriction, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-greek-blue/5">
                          <Leaf className="h-3 w-3 mr-1" />
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  {selectedRecipe.videoUrl && (
                    <Button 
                      className="bg-greek-blue hover:bg-greek-blue/90"
                      onClick={() => window.open(selectedRecipe.videoUrl, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Cooking Video
                    </Button>
                  )}
                  <Button variant="outline" className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add to Cookbook
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