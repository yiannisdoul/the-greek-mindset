import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorkoutCardProps {
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  exercises: string[]
}

export function WorkoutCard({ title, description, duration, difficulty, exercises }: WorkoutCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge variant={difficulty === "Beginner" ? "default" : difficulty === "Intermediate" ? "secondary" : "destructive"}>
            {difficulty}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{duration}</p>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        <h4 className="font-semibold mb-2">Exercises:</h4>
        <ul className="list-disc list-inside">
          {exercises.map((exercise, index) => (
            <li key={index} className="text-sm">{exercise}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

