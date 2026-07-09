import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { IPayment } from "./payment.interface";



//& create payment intent
const createPayIntent = async (userId: string, payload: IPayment) => {
  
  const {bookingId} = payload
  
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });

  if(!booking){
    throw new Error("Booking not found")
  }

  if(booking.customerId !== userId){
    throw new Error("Unauthorized access!!")
  }

  // if(booking.status === 'PAID'){
  //   throw new Error("You already paid")
  // }

  if(booking.status !== 'ACCEPTED'){
    throw new Error("Booking is not accepted yet")
  }

  const paid = await prisma.payment.findUnique({
    where: {bookingId}
  })

  if(paid){
    throw new Error("You alrady paid")
  }


  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(booking.totalAmount) * 100,
    currency: 'bdt',
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId
    }
  })

  return {
    clientSecret: paymentIntent.client_secret
  }
}


export const paymentService = {
  createPayIntent,
  
}