import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IReviewCreate } from "./review.interface"



//& create review
const createReviewIntoDB = async (customerId: string, payload: IReviewCreate) => {

 const { bookingId, rating, comment} = payload;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return null
  }
  
  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking");
  }


  if (booking.status !== 'COMPLETED') {
    throw new Error('You are not aligeble for review!!')
  }

   const existingReview = await prisma.review.findFirst({
    where: { serviceId: booking.serviceId, customerId, technicianId: booking.technicianId },
  });


   if (existingReview) {
    throw new Error("You have already reviewed this booking");
  }

  const technicianId = booking.technicianId

  const review = await prisma.review.create({
    data: {
      serviceId: booking.serviceId,
      customerId: booking.customerId,
      technicianId,
      rating,
      comment
    }
  })
  return review
}


export const reviewService = {
  createReviewIntoDB,

}