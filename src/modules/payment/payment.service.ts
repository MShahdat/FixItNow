import Stripe from "stripe";
import config from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { IPayment } from "./payment.interface";
import { paymentSuccess } from "./payment.utility";
import { BookingStatus } from "../../../generated/prisma/enums";



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
      bookingId: true,
      amount: true,
      status: true,
      transactionId: true,
      paymentIntentId: true,
      paidAt: true,
      booking: {
        select: {
          service: {
            select: {
              title: true,
              type: true,
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
          },
        }
      },
    }
  })

  return history.map((his) => ({
    bookingId: his.bookingId,
    technicianName: `${his.booking.service.technician.user.firstName} ${his.booking.service.technician.user.lastName ?? ""}`.trim(),
    serviceTitle: his.booking.service.title,
    serviceType: his.booking.service.type,
    amount: Number(his.amount),
    status: his.status,
    transactionId: his.transactionId,
    paymentIntentId: his.paymentIntentId,
    paidAt: his.paidAt,
  }));
}



//& get payment by id
const getPaymentFromDB = async (id: string, userId: string) => {

  console.log('id', id)
  console.log('user id', userId)

  const result = await prisma.payment.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      transactionId: true,
      paymentIntentId: true,
      amount: true,
      status: true,
      paidAt: true,
      booking: {
        select: {
          serviceId: true,
          scheduledDate: true,
          address: true,
          status: true,
          customer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
          service: {
            select: {
              title: true,
              category: true,
              duration: true,
              review: {
                select: {
                  rating: true,
                  comment: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    transactionId: result.transactionId,
    paymentIntentId: result.paymentIntentId,
    amount: result.amount,
    paymentStatus: result.status,
    paidAt: result.paidAt,

    bookingStatus: result.booking.status,
    scheduledDate: result.booking.scheduledDate,
    address: result.booking.address,
    serviceId: result.booking.serviceId,

    customerName: `${result.booking.customer.firstName} ${result.booking.customer.lastName ?? ""}`.trim(),
    customerEmail: result.booking.customer.email,
    customerPhone: result.booking.customer.phone,
    customerStatus: result.booking.customer.status,

    serviceTitle: result.booking.service.title,
    serviceCategory: result.booking.service.category,
    serviceDuration: result.booking.service.duration,

    rating: result.booking.service.review?.[0]?.rating ?? null,
    comment: result.booking.service.review?.[0]?.comment ?? null,
  };
}





export const paymentService = {
  createCheckoutSession,
  paymentWebhook,
  payHisoty,
  getPaymentFromDB,

}