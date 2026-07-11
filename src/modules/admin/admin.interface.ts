import { Role, UserStatus } from "../../../generated/prisma/enums";
import {UserWhereInput } from "../../../generated/prisma/models";


export interface IUserStatus {
  status: UserStatus
}



export interface Query extends UserWhereInput {
  search?: string
  sortOrder?: string
  sortBy?: string
  limit?: string
  page?: string
  skill?: string[]
  status?: UserStatus,
  role?: Role,
  minExperience?: number,
  maxExperience?: number
}






export interface ICategoryCreate {
  name: string
  icon?: string
  description: string
}




export interface ICategoryUpdate {
  name?: string
  icon?: string
  description?: string
}
