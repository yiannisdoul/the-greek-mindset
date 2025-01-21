import type { NextApiRequest, NextApiResponse } from "next"
import { getArticle, updateArticle, deleteArticle } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const articleId = Array.isArray(id) ? id[0] : id

  if (!articleId) {
    return sendError(res, 400, "Article ID is required")
  }

  switch (req.method) {
    case "GET":
      try {
        const article = await getArticle(articleId)
        if (!article) {
          return sendError(res, 404, "Article not found")
        }
        return sendSuccess(res, article)
      } catch (error) {
        return sendError(res, 500, "Error fetching article")
      }

    case "PUT":
      try {
        const data = JSON.parse(req.body)
        await updateArticle(articleId, data)
        return sendSuccess(res, { message: "Article updated successfully" })
      } catch (error) {
        return sendError(res, 500, "Error updating article")
      }

    case "DELETE":
      try {
        await deleteArticle(articleId)
        return sendSuccess(res, { message: "Article deleted successfully" })
      } catch (error) {
        return sendError(res, 500, "Error deleting article")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

