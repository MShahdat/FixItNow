import { prisma } from "../../lib/prisma"
import { IServicePayload } from "./service.interface"


const createServiceIntoDB = async (userId: string, payload: IServicePayload) => {
  const { categoryId } = payload

  const cate = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  })

  if (!cate) {
    return null
  }

  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  })

  if (!technicianProfile) {
    throw new Error('Internal server error')
  }

  const service = await prisma.services.create({
    data: {
      ...payload,
      technicianProfileId: technicianProfile.id
    }
  })

  return service
}


export const serviceService = {
  createServiceIntoDB,

}