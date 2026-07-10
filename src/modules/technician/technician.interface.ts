import { BookingStatus } from "../../../generated/prisma/enums";



export interface IBookingUpdate {
  status: "ACCEPTED" | "DECLINED"
  cancelReason?: string
}



export interface ISetAvailability {
  availability: string[]
}


