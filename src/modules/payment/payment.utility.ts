import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";

export const paymentSuccess = async (session: Stripe.Checkout.Session) => {
  try {
    const bookingId = session.metadata?.bookingId as string;
    const customerId = session.metadata?.customerId as string;
    const paymentIntentId = session.payment_intent as string;

    const paymentIntent =
      await stripe.paymentIntents.retrieve(paymentIntentId);

    const transactionResult = await prisma.$transaction(
      async (tx) => {
        const payment = await tx.payment.create({
          data: {
            bookingId,
            userId: customerId,
            transactionId: paymentIntent.latest_charge as string,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
          },
        });

        const bo = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.PAID,
            completedAt: new Date(),
          },
        });

        return payment;
      },
      {
        maxWait: 20000,
        timeout: 20000
      }
    );

    return transactionResult;

  } catch (err) {
    console.error("paymentSuccess ERROR");
    console.error(err);
    throw err;
  }
};