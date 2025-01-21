import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">About The Greek Mindset</h1>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            The Greek Mindset is dedicated to reviving the wisdom of ancient Greece and applying it to modern life. We
            believe that the philosophies, practices, and disciplines of the ancient Greeks hold invaluable lessons for
            today's world.
          </p>
          <p>
            Our goal is to educate and inspire individuals to cultivate both their minds and bodies, embracing the
            holistic approach to life that was central to Greek culture.
          </p>
        </div>
        <div className="relative h-64 md:h-full">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Ancient Greek ruins"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>In-depth articles on Greek philosophy, history, and culture</li>
          <li>Workout plans inspired by ancient Greek training methods</li>
          <li>Curated products that embody the Greek ethos</li>
          <li>Community forums for discussion and shared learning</li>
        </ul>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Sophia Athena", role: "Founder & Philosopher" },
            { name: "Alexander Spartan", role: "Fitness Expert" },
            { name: "Helena Troy", role: "Historian & Content Creator" },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Image
                  src={`/placeholder.svg?height=150&width=150&text=${member.name}`}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Us on This Journey</h2>
        <p className="mb-6">
          Embark on a path of self-improvement and discovery. Let the wisdom of the ancients guide you to a more
          fulfilled and balanced life.
        </p>
        <AuthModal />
      </div>
    </div>
  )
}

