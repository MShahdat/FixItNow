import { Request, Response } from "express"
import catchAsync from "../../utility/catchAsync"
import { reviewService } from "./review.service"
import { notFoundResponse, successResponse } from "../../utility/sendResponse"
import httpCode from 'http-status'


//& create booking 
const createBooking = catchAsync(
  async(req: Request, res: Response) => {
    const customerId = req.user?.id as string
    const body = req.body

    const result = await reviewService.createReviewIntoDB(customerId, body)

    if(!result){
      return notFoundResponse(res, 'service not found!!')
    }

    return successResponse(res, httpCode.CREATED, 'review created successfully', result)

  }
)



export const reviewController = {
  createBooking,


}