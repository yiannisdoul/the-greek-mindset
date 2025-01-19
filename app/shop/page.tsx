import { ProductCard } from "@/components/product-card"

const products = [
  {
    id: "1",
    name: "Spartan Shield",
    description: "Authentic replica of a Spartan shield",
    price: 199.99,
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    id: "2",
    name: "Philosopher's Toga",
    description: "Comfortable toga for deep thinking",
    price: 59.99,
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    id: "3",
    name: "Socratic Method Guide",
    description: "Learn the art of questioning everything",
    price: 24.99,
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    id: "4",
    name: "Olympian Olive Oil",
    description: "Premium olive oil from Greek groves",
    price: 19.99,
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    id: "5",
    name: "Stoic Meditation Cushion",
    description: "Find your inner peace with this cushion",
    price: 39.99,
    imageUrl: "/placeholder.svg?height=300&width=400"
  },
  {
    id: "6",
    name: "Aristotle's Logic Puzzle Set",
    description: "Sharpen your mind with these puzzles",
    price: 29.99,
    imageUrl: "/placeholder.svg?height=300&width=400"
  }
]

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

