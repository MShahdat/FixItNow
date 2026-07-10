import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IBooking } from "./booking.interface"



//& booking create
const createBooking = async (customerId: string, payload: IBooking) => {
  console.log(payload)
  const { serviceId } = payload


  const isService = await prisma.services.findUnique({
    where: {
      id: serviceId,
      isActive: true
    }
  })

  if (!isService) {
    return 'not service'
  }

  const technicianId = isService.technicianProfileId
  const totalAmount = isService.price


  const bookingCreate = await prisma.booking.create({
    data: {
      ...payload,
      totalAmount,
      technicianId,
      serviceId,
      customerId
    }
  })

  return bookingCreate
}


//& booking get
const getBooking = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    select: {
      id: true,
      scheduledDate: true,
      status: true,
      totalAmount: true,
      service: {
        select: {
          title: true,
        },
      },
      technician: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      }
    }
  })

  return bookings.map((booking) => ({
    id: booking.id,
    serviceTitle: booking.service.title,
    technicianName: `${booking.technician.user.firstName} ${booking.technician.user.lastName ?? ""}`.trim(),
    scheduledDate: booking.scheduledDate,
    status: booking.status,
    totalAmount: Number(booking.totalAmount),
  }));
};


//& booking get for details
const getBookingById = async (id: string) => {

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      payment: true,
      technician: true
    },
  })

  return booking
}


//& cancle booking
const cancleBookingFromDB = async (userId: string, bookingId: string, payload: any) => {

  const {cancelReason} = payload

  const transectionResult = await prisma.$transaction(
    async (tx) => {
      const book = await tx.booking.findUnique({
        where: {id: bookingId}
      })

      if(!book){
        return null
      }

      if(book.status !== "IN_PROGRESS"){
        throw new Error(`you can't cancel booking`)
      }
      
      const updated = await tx.booking.update({
        where: {
          id: bookingId,
          customerId: userId,
        },
        data: {
          status: BookingStatus.CANCELLED,
          cancelReason,
          canceledAt: new Date(),
        }
      })

      await tx.payment.update({
        where: {bookingId},
        data: {
          status: PaymentStatus.REFUNDED
        }
      })

      return updated
    },
    {
      maxWait: 20000,
      timeout: 20000
    }
  )

  return transectionResult
}


export const bookingService = {
  createBooking,
  getBooking,
  getBookingById,
  cancleBookingFromDB,

}