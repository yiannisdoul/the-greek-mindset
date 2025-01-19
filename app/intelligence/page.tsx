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
    title: 'Plato\'s Theory of Forms',
    excerpt: 'Understand the fundamental concepts of Plato\'s metaphysical theory.',
    category: 'Philosophy',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Aristotle Scholar',
    date: 'June 1, 2025'
  },
  {
    id: '3',
    title: 'The Socratic Method in Modern Discourse',
    excerpt: 'Learn how to apply Socratic questioning in contemporary debates and discussions.',
    category: 'Critical Thinking',
    imageUrl: '/placeholder.svg?height=300&width=400',
    author: 'Logical Thinker',
    date: 'June 10, 2025'
  },
  // Add more articles as needed
]

export default function IntelligencePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Intelligence: Cultivate Your Mind</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  )
}

