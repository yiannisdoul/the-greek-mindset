import type { NextApiRequest, NextApiResponse } from "next"
import { getWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const planId = Array.isArray(id) ? id[0] : id

  if (!planId) {
    return sendError(res, 400, "Workout plan ID is required")
  }

  switch (req.method) {
    case "GET":
      try {
        const workoutPlan = await getWorkoutPlan(planId)
        if (!workoutPlan) {
          return sendError(res, 404, "Workout plan not found")
        }
        return sendSuccess(res, workoutPlan)
      } catch (error) {
        return sendError(res, 500, "Error fetching workout plan")
      }

    case "PUT":
      try {
        const data = JSON.parse(req.body)
        await updateWorkoutPlan(planId, data)
        return sendSuccess(res, { message: "Workout plan updated successfully" })
      } catch (error) {
        return sendError(res, 500, "Error updating workout plan")
      }

    case "DELETE":
      try {
        await deleteWorkoutPlan(planId)
        return sendSuccess(res, { message: "Workout plan deleted successfully" })
      } catch (error) {
        return sendError(res, 500, "Error deleting workout plan")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

