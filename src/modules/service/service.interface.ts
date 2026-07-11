import { ServicesWhereInput } from "../../../generated/prisma/models"


export interface IServiceCreate {
  categoryId: string
  title: string
  description: string
  price: number
  location: string[]
  duration: string
  availableAt: string[]
}




export interface IServiceUpdate {
  title?: string
  description?: string
  type?: string,
  price?: number
  location?: string[]
  duration?: string
  availableAt?: string[]
}



export interface Query extends Omit<ServicesWhereInput, "location"> {
  search?: string
  sortOrder?: string
  sortBy?: string
  limit?: string
  page?: string
  type?: string
  location?: string
  minRating?: number
  maxRating?: number
  minPrice?: number
  maxPrice?: number
}