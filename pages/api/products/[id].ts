import type { NextApiRequest, NextApiResponse } from "next"
import { getProduct, updateProduct, deleteProduct } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const productId = Array.isArray(id) ? id[0] : id

  if (!productId) {
    return sendError(res, 400, "Product ID is required")
  }

  switch (req.method) {
    case "GET":
      try {
        const product = await getProduct(productId)
        if (!product) {
          return sendError(res, 404, "Product not found")
        }
        return sendSuccess(res, product)
      } catch (error) {
        return sendError(res, 500, "Error fetching product")
      }

    case "PUT":
      try {
        const data = JSON.parse(req.body)
        await updateProduct(productId, data)
        return sendSuccess(res, { message: "Product updated successfully" })
      } catch (error) {
        return sendError(res, 500, "Error updating product")
      }

    case "DELETE":
      try {
        await deleteProduct(productId)
        return sendSuccess(res, { message: "Product deleted successfully" })
      } catch (error) {
        return sendError(res, 500, "Error deleting product")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

