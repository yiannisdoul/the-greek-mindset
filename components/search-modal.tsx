'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

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

export function SearchModal() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof sampleData>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = sampleData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleResultClick = (slug: string, type: string) => {
    setIsOpen(false)
    if (type === 'Article') {
      router.push(`/articles/${slug}`)
    } else if (type === 'Workout') {
      router.push(`/workout-plan/${slug}`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-300">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Results:</h3>
              <ul className="space-y-2">
                {searchResults.slice(0, 5).map((result) => (
                  <li 
                    key={result.id} 
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => handleResultClick(result.slug, result.type)}
                  >
                    <span>{result.title}</span>
                    <span className="text-sm text-gray-500">{result.type}</span>
                  </li>
                ))}
              </ul>
              {searchResults.length > 5 && (
                <Button 
                  variant="link" 
                  className="mt-2" 
                  onClick={handleSearch}
                >
                  See all results
                </Button>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

