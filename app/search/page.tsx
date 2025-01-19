'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

// This would typically come from your actual data source
const sampleData = [
  { id: 1, title: "Introduction to Stoicism", type: "Article", slug: "intro-to-stoicism" },
  { id: 2, title: "Spartan Workout Routine", type: "Workout", slug: "spartan-workout" },
  { id: 3, title: "Plato's Republic: A Summary", type: "Article", slug: "platos-republic" },
  { id: 4, title: "Greek-Inspired Meditation Techniques", type: "Workout", slug: "greek-meditation" },
  { id: 5, title: "The Life of Socrates", type: "Article", slug: "life-of-socrates" },
  { id: 6, title: "Olympic Athlete Training Program", type: "Workout", slug: "olympic-training" },
  { id: 7, title: "Understanding Aristotle's Ethics", type: "Article", slug: "aristotle-ethics" },
  { id: 8, title: "Ancient Greek Diet and Nutrition", type: "Article", slug: "greek-diet" },
]

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<typeof sampleData>([])

  useEffect(() => {
    const results = sampleData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(results)
  }, [query])

  const handleResultClick = (slug: string, type: string) => {
    if (type === 'Article') {
      router.push(`/articles/${slug}`)
    } else if (type === 'Workout') {
      router.push(`/workout-plan/${slug}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
      {searchResults.length > 0 ? (
        <ul className="space-y-4">
          {searchResults.map((result) => (
            <li 
              key={result.id} 
              className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-4 rounded"
              onClick={() => handleResultClick(result.slug, result.type)}
            >
              <span className="text-xl">{result.title}</span>
              <span className="text-sm text-gray-500">{result.type}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{query}"</p>
      )}
      <Button onClick={() => router.back()} className="mt-8">
        Back to previous page
      </Button>
    </div>
  )
}

