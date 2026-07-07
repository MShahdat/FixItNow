import { Request, Response } from "express"


export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: 'Route not found',
    path: req.originalUrl
  })
} 