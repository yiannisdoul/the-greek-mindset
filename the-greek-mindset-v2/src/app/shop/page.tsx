// src/app/shop/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Filter, Grid, List, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/shop/product-card';
import { Cart } from '@/components/shop/cart';
import { useCart } from '@/hooks/use-cart';
import { Product, ProductCategory } from '@/types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ancient Greek Philosophy Bundle',
    description: 'Complete collection of Plato, Aristotle, and Socrates works with modern commentary',
    price: 89.99,
    originalPrice: 129.99,
    image: '/images/philosophy-bundle.jpg',
    category: 'books',
    rating: 4.9,
    reviews: 247,
    inStock: true,
    tags: ['philosophy', 'classics', 'education']
  },
  {
    id: '2',
    name: 'Spartan Resistance Bands Set',
    description: 'Professional-grade resistance bands inspired by ancient Spartan training methods',
    price: 49.99,
    originalPrice: 69.99,
    image: '/images/resistance-bands.jpg',
    category: 'fitness',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    tags: ['fitness', 'spartan', 'training']
  },
  {
    id: '3',
    name: 'Greek Mythology Poster Set',
    description: 'Beautiful illustrated posters featuring the 12 Olympian gods',
    price: 34.99,
    image: '/images/mythology-posters.jpg',
    category: 'decor',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    tags: ['mythology', 'art', 'decor']
  },
  {
    id: '4',
    name: 'Mediterranean Diet Cookbook',
    description: 'Authentic Greek recipes for modern healthy living',
    price: 24.99,
    originalPrice: 34.99,
    image: '/images/cookbook.jpg',
    category: 'books',
    rating: 4.6,
    reviews: 203,
    inStock: false,
    tags: ['cooking', 'health', 'mediterranean']
  },
  {
    id: '5',
    name: 'Greek Key Pattern Yoga Mat',
    description: 'Premium yoga mat with traditional Greek meander pattern',
    price: 79.99,
    image: '/images/yoga-mat.jpg',
    category: 'fitness',
    rating: 4.9,
    reviews: 91,
    inStock: true,
    tags: ['yoga', 'fitness', 'greek-pattern']
  },
  {
    id: '6',
    name: 'Ancient Wisdom Journal',
    description: 'Leather-bound journal with philosophical quotes and prompts',
    price: 39.99,
    image: '/images/wisdom-journal.jpg',
    category: 'stationery',
    rating: 4.7,
    reviews: 134,
    inStock: true,
    tags: ['journal', 'wisdom', 'writing']
  }
];

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'books', label: 'Books' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'decor', label: 'Home & Decor' },
  { id: 'stationery', label: 'Stationery' }
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const { items: cartItems, addToCart, getTotalItems } = useCart();

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Greek-inspired header border */}
      <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-stone-800">Greek Mindset Shop</h1>
              <div className="h-6 w-px bg-stone-300"></div>
              <p className="text-stone-600">Wisdom & Wellness Marketplace</p>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex border border-stone-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-stone-600">
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== 'all' && (
              <span className="ml-2 text-amber-600 font-medium">
                in {CATEGORIES.find(cat => cat.id === selectedCategory)?.label}
              </span>
            )}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ProductCard
                product={product}
                viewMode={viewMode}
                isWishlisted={wishlist.includes(product.id)}
                onAddToCart={() => handleAddToCart(product)}
                onToggleWishlist={() => toggleWishlist(product.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-stone-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">No products found</h3>
            <p className="text-stone-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Cart Sidebar */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Greek-inspired footer border */}
      <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
    </div>
  );
}