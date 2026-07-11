import { UserStatus } from "../../../generated/prisma/enums"
import { TechnicianProfileWhereInput } from "../../../generated/prisma/models"


export interface IBookingUpdate {
  status: "ACCEPTED" | "DECLINED" | "COMPLETED"
  cancelReason?: string
}



export interface ISetAvailability {
  availability: string[]
}


export interface Query extends TechnicianProfileWhereInput{
  search?: string
  sortOrder?: string
  sortBy?: string
  limit?: string
  page?: string
  skill?: string[]
  minExperience?: number
  maxExperience?: number
  status?: UserStatus
}