import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  category: string
  imageUrl: string
  author: string
  date: string
}

export function ArticleCard({ id, title, excerpt, category, imageUrl, author, date }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
            {category}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <p className="text-gray-600 text-sm mb-4">{excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/articles/${id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

