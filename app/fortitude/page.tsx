import { WorkoutCard } from "@/components/workout-card"

const workouts = [
  {
    title: "Spartan Strength",
    description: "Build strength and endurance like a Spartan warrior.",
    duration: "45 minutes",
    difficulty: "Intermediate",
    exercises: ["Push-ups", "Squats", "Lunges", "Plank hold", "Burpees"]
  },
  {
    title: "Athenian Agility",
    description: "Improve your agility and speed with this high-intensity workout.",
    duration: "30 minutes",
    difficulty: "Advanced",
    exercises: ["High knees", "Mountain climbers", "Jump rope", "Lateral jumps", "Shuttle runs"]
  },
  {
    title: "Olympian Core",
    description: "Strengthen your core with exercises inspired by Olympic athletes.",
    duration: "20 minutes",
    difficulty: "Beginner",
    exercises: ["Crunches", "Russian twists", "Leg raises", "Bicycle crunches", "Superman holds"]
  },
] as const;

export default function FortitudePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Fortitude: Build Your Strength</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workouts.map((workout, index) => (
          <WorkoutCard key={index} {...workout} />
        ))}
      </div>
    </div>
  )
}

