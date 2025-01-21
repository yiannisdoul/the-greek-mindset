import type { NextApiRequest, NextApiResponse } from "next"
import { getWorkoutPlans, createWorkoutPlan } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const workoutPlans = await getWorkoutPlans()
        return sendSuccess(res, workoutPlans)
      } catch (error) {
        return sendError(res, 500, "Error fetching workout plans")
      }

    case "POST":
      try {
        const data = JSON.parse(req.body)
        await createWorkoutPlan(data)
        return sendSuccess(res, { message: "Workout plan created successfully" })
      } catch (error) {
        return sendError(res, 500, "Error creating workout plan")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

