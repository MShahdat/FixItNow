import Stripe from "stripe";
import config from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { IPayment } from "./payment.interface";
import { paymentSuccess } from "./payment.utility";



//& create checkout session
const createCheckoutSession = async (userId: string, payload: IPayment) => {
  const { bookingId } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  if (booking.customerId !== userId) {
    throw new Error("Unauthorized access");
  }

  if (booking.status === "IN_PROGRESS") {
    throw new Error("Already paid");
  }

  if (booking.status === 'COMPLETED') {
    throw new Error("Job already completed")
  }

  if (booking.status !== "ACCEPTED") {
    throw new Error("Booking is not accepted");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "bdt",
          unit_amount: Number(booking.totalAmount) * 100,
          product_data: {
            name: `Booking #${booking.id}`,
            description: "FixItNow Service Booking"
          }
        }
      }
    ],
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${config.app_url}/payment/success`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId
    }
  });

  return {
    paymentUrl: session.url
  };

};


// //& payment webhook
const paymentWebhook = async (signature: string, payload: Buffer) => {

  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );

  switch (event.type) {
    case "checkout.session.completed":
      console.log('seccess...')
      await paymentSuccess(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      console.log("Unhandled Event");
  }
};



//& payment history
const payHisoty = async (userId: string) => {

  const history = await prisma.payment.findMany({
    where: { userId },
    select: {
      amount: true,
      status: true,
      transactionId: true,
      paidAt: true,
      booking: {
        select: {
          service: {
            select: {
              title: true,
              technician: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              }
            }
          }
        }
      }
    }
  })

  return history.map((his) => ({
    serviceName: his.booking.service.title,
    technicianName: `${his.booking.service.technician.user.firstName} ${his.booking.service.technician.user.lastName ?? ""}`.trim(),
    amount: Number(his.amount),
    status: his.status,
    transactionId: his.transactionId,
    paidAt: his.paidAt,
  }));
}


export const paymentService = {
  createCheckoutSession,
  paymentWebhook,
  payHisoty,

}