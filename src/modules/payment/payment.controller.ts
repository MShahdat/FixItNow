import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { paymentService } from "./payment.service";
import {successResponse } from "../../utility/sendResponse";
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



export const paymentController = {
  createCheckoutSession,
  stripeWebhook,

}