import { BookingStatus, Prisma } from "../../../generated/prisma/client"


export interface IBooking {
  
  serviceId: string
  scheduledDate: Date
  address: string
  note?: string

  totalAmount?: Prisma.Decimal
  status?: BookingStatus
  cancleReason?: string

  acceptedAt?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  canceledAt?: Date | null;

}



export interface IBookingCancle {
  cancelReason: string
}