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

  console.log('service ', isService)
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

  const bookings = await prisma.booking.findMany({
    where: { id },
    include: {
      service: true,
      payment: true,
      review: true
    },
  })

  return bookings

}




export const bookingService = {
  createBooking,
  getBooking,
  getBookingById,

}