import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { paymentService } from "./payment.service";
import {notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'


//& create checkout session
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req.user?.id as string;

    const result = await paymentService.createCheckoutSession(
      userId,
      req.body
    );

    return successResponse(
      res,
      httpCode.CREATED,
      "Checkout session created successfully",
      result
    );
  }
);


//& webhook
const stripeWebhook = catchAsync(
  async (req: Request, res: Response) => {

    const signature = req.headers['stripe-signature'] as string;
    const event = req.body as Buffer;

    await paymentService.paymentWebhook(signature, event);

    return res.status(200).json({ received: true });
  }
);



//& payment history
const history = catchAsync(
  async(req: Request, res: Response) => {
    const userId = req.user?.id as string

    const result = await paymentService.payHisoty(userId)

    if(!result){
      return notFoundResponse(res, 'you are not payment yet')
    }
    return successResponse(res, httpCode.OK, 'my history retrive successfully', result)
  }
)

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
  history,

}