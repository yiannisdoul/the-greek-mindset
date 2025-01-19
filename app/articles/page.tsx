import { ArticleCard } from '@/components/article-card'

// This would typically come from a database or API
const articles = [
  {
    id: '1',
    title: 'The Stoic Philosophy of Marcus Aurelius',
    excerpt: 'Explore the wisdom of the philosopher king and how it applies to modern life.',
    category: 'Philosophy',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Sophia Athena',
    date: 'May 15, 2025'
  },
  {
    id: '2',
    title: 'Spartan Training Techniques for Mental Toughness',
    excerpt: 'Learn how to build resilience and mental strength using ancient Spartan methods.',
    category: 'Fitness',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Leonidas Trainer',
    date: 'June 1, 2025'
  },
  {
    id: '3',
    title: 'The Mediterranean Diet: Eating Like the Ancients',
    excerpt: 'Discover the health benefits of traditional Greek cuisine and how to incorporate it into your diet.',
    category: 'Diet',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Hippocrates Health',
    date: 'June 10, 2025'
  },
  // Add more articles as needed
]

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  )
}

