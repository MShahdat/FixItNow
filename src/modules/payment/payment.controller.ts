import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { paymentService } from "./payment.service";
import { errorResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import config from "../../config/env";
import { prisma } from "../../lib/prisma";


//& create
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




//& webhook
const stripeWebhook = catchAsync(
  async(req: Request, res: Response) =>{
    const signature = req.headers['stripe-signature']!
    let event

    console.log('event type before ', event)

    try{
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        config.stripe_webhook_secret
      )
    }catch{
      return res.status(400).send("Webhook Error");
    }

    console.log('event type after ==== ', event)

    console.log('event type ', event.type)

    
    switch(event.type){
      case 'payment_intent.succeeded': 
        console.log('payment successfull')
        break;

      case 'payment_intent.payment_failed': 
        console.log('payment failed')
        break;

      case 'payment_intent.processing':
        console.log('payment processing')
        break;

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({
      received: true
    })

  }
 )


export const paymentController = {
  createPaymentIntent,
  stripeWebhook,

}