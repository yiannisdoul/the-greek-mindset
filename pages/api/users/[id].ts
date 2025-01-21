import type { NextApiRequest, NextApiResponse } from "next"
import { getUserProfile, updateUserProfile } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const userId = Array.isArray(id) ? id[0] : id

  if (!userId) {
    return sendError(res, 400, "User ID is required")
  }

  switch (req.method) {
    case "GET":
      try {
        const userProfile = await getUserProfile(userId)
        if (!userProfile) {
          return sendError(res, 404, "User not found")
        }
        return sendSuccess(res, userProfile)
      } catch (error) {
        return sendError(res, 500, "Error fetching user profile")
      }

    case "PUT":
      try {
        const data = JSON.parse(req.body)
        await updateUserProfile(userId, data)
        return sendSuccess(res, { message: "User profile updated successfully" })
      } catch (error) {
        return sendError(res, 500, "Error updating user profile")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

