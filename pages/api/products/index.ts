import type { NextApiRequest, NextApiResponse } from "next"
import { getProducts, createProduct } from "@/lib/firebase/firestore"
import { sendError, sendSuccess } from "@/lib/api-utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const products = await getProducts()
        return sendSuccess(res, products)
      } catch (error) {
        return sendError(res, 500, "Error fetching products")
      }

    case "POST":
      try {
        const data = JSON.parse(req.body)
        await createProduct(data)
        return sendSuccess(res, { message: "Product created successfully" })
      } catch (error) {
        return sendError(res, 500, "Error creating product")
      }

    default:
      return sendError(res, 405, "Method not allowed")
  }
}

