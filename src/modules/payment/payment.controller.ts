import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { paymentService } from "./payment.service";
import { errorResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'

const createPaymentIntent = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req.user?.id as string
    const body = req.body

    const result = await paymentService.createPayIntent( userId, body);

    if(!result){
      return errorResponse(res, "internal server error", null)
    }

    return successResponse(res, httpCode.CREATED, 'Payment intent created', result)

  });




export const paymentController = {
  createPaymentIntent,

}