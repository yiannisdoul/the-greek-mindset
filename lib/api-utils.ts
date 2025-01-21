import type { NextApiResponse } from "next"

export const sendError = (res: NextApiResponse, status: number, message: string) => {
  res.status(status).json({ error: message })
}

export const sendSuccess = (res: NextApiResponse, data: any) => {
  res.status(200).json(data)
}

