// src/components/shop/product-card.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isWishlisted?: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

export function ProductCard({ 
  product, 
  viewMode = 'grid', 
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist 
}: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-amber-400 fill-current'
            : index < rating
            ? 'text-amber-400 fill-current opacity-50'
            : 'text-stone-300'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition-all duration-300"
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex space-x-6">
          {/* Product Image */}
          <div className="relative flex-shrink-0 w-32 h-32 bg-stone-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
              <Eye className="h-8 w-8 text-stone-400" />
            </div>
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-stone-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-stone-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-stone-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Tags */}
                <div className="flex space-x-2 mb-4">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col items-end space-y-3 ml-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-stone-900">
                    ${product.price.toFixed(2)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-stone-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleWishlist}
                    className="p-2"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted ? 'text-red-500 fill-current' : 'text-stone-400'
                      }`}
                    />
                  </Button>
                  <Button
                    onClick={onAddToCart}
                    disabled={!product.inStock}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      className="group bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -4 }}
      layout
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
          <Eye className="h-16 w-16 text-stone-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? 'text-red-500 fill-current' : 'text-stone-400'
            }`}
          />
        </Button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-stone-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-stone-600">
            ({product.reviews})
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-stone-900">
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-stone-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          <Button
            onClick={onAddToCart}
            disabled={!product.inStock}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}