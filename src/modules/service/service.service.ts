import { BookingStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { IServiceCreate, IServiceUpdate, Query } from "./service.interface"

//& CREATE SERVICES INTO DB
const createServiceIntoDB = async (userId: string, payload: IServiceCreate) => {
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
      type: cate.name,
      technicianProfileId: technicianProfile.id
    }
  })

  return service
}



//& GET ALL SERVICES
const allServicesFromDB = async (query: Query) => {

  const sort = query.sortBy ? query.sortBy : 'createdAt';
  const order = query.sortOrder ? query.sortOrder : 'desc';
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)


  const andConditions: Prisma.ServicesWhereInput[] = []

  //! searching
  if (query.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.search as string,
            mode: "insensitive"
          }
        }
      ]
    })
  }

  // ! filtering
  if (query.location) {
    const location = query.location as string
    const arrLocation = location.split(',').map((item) => item.trim())

    andConditions.push({
      location: {
        hasSome: arrLocation
      }
    })
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        ...(query.minPrice && { gte: Number(query.minPrice) }),
        ...(query.maxPrice && { lte: Number(query.maxPrice) }),
      },
    });
  }

  if (query.type) {
    andConditions.push({
      type: (query.type) as string
    })
  }



  const services = await prisma.services.findMany({
    where: {
      AND: andConditions
    },
    include: {
      review: {
        omit: {
          createdAt: true,
          updatedAt: true,
          customerId: true,
          id: true,
          serviceId: true,
          technicianId: true,

        }
      }
    },
    take: limit,
    skip: (page - 1) * limit,

    orderBy: {
      [sort as string]: order as Prisma.SortOrder
    },
  })

  const total = await prisma.services.count({
    where: {
      AND: andConditions
    },
  })

  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  }

  return {
    services,
    meta
  }

}



//& UPDATE SERVICE PROFILE
const updateServiceIntoDB = async (id: string, userId: string,  payload: IServiceUpdate) => {

  const service = await prisma.services.findUnique({
    where: { id }
  })

  if (!service) {
    return null
  }

  console.log('service',service)
  const pId = service.technicianProfileId


  const profile = await prisma.technicianProfile.findUnique({
    where: {userId}
  })

  if(pId !== profile?.id){
    return 'unauth'
  }

  const hasPendingRequest = await prisma.booking.findFirst({
    where: { serviceId: id, status: "REQUESTED" },
  });

  if(hasPendingRequest){
    throw new Error("Cannot update service while there are pending booking requests")
  }

  const updated = await prisma.services.update({
    where: {id}, 
    data: payload
  })

  return updated

}



export const serviceService = {
  createServiceIntoDB,
  allServicesFromDB,
  updateServiceIntoDB,

}