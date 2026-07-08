import { prisma } from "../../lib/prisma"
import { IBooking } from "./booking.interface"



//& booking create
const createBooking = async(customerId: string, payload: IBooking) => {
  console.log(payload)
  const {serviceId} = payload


  const isService = await prisma.services.findUnique({
    where: {
      id: serviceId,
      isActive: true
    }
  }) 

  console.log('service ' , isService)
  if(!isService){
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
const getBooking = async(customerId: string) => {
 
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    include: {
      service: true
    },
  })

  return bookings

}


export const bookingService = {
  createBooking,
  getBooking,

}