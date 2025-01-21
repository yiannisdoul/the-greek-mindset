import type { NextApiRequest, NextApiResponse } from "next"
import { getArticles, createArticle } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const articles = await getArticles()
        return sendSuccess(res, articles)
      } catch (error) {
        return sendError(res, 500, "Error fetching articles")
      }

    case "POST":
      try {
        const data = JSON.parse(req.body)
        await createArticle(data)
        return sendSuccess(res, { message: "Article created successfully" })
      } catch (error) {
        return sendError(res, 500, "Error creating article")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

