/**
 * Square Payment Configuration
 * 
 * This file contains the configuration for Square payment integration.
 * Make sure to set the environment variables in your .env.local file.
 */

export const squareConfig = {
  // Application ID from Square Dashboard (Public - safe for client-side)
  applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '',
  
  // Location ID from Square Dashboard (Public - safe for client-side)
  locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '',
  
  // Access Token from Square Dashboard (Server-side only - NEVER expose to client)
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  
  // Environment: 'sandbox' for testing, 'production' for live
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
}

// Square Web SDK URLs based on environment
export const SQUARE_WEB_SDK_URL = 
  squareConfig.environment === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js'

// Currency configuration
export const CURRENCY = 'USD'

// Validate required configuration
export function validateSquareConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!squareConfig.applicationId) {
    errors.push('NEXT_PUBLIC_SQUARE_APPLICATION_ID is not set')
  }

  if (!squareConfig.locationId) {
    errors.push('NEXT_PUBLIC_SQUARE_LOCATION_ID is not set')
  }

  if (!squareConfig.accessToken) {
    errors.push('SQUARE_ACCESS_TOKEN is not set (required for server-side operations)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
