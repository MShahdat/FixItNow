import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { IServicePayload } from "./service.interface"
import { Query } from "express-serve-static-core";

//& CREATE SERVICES INTO DB
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

  if (query.minRating || query.maxRating) {
    andConditions.push({
      rating: {
        ...(query.minRating && { gte: Number(query.minRating) }),
        ...(query.maxRating && { lte: Number(query.maxRating) }),
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
    take: limit,
    skip: (page - 1) * limit,

    orderBy: {
      [sort as string]: order as Prisma.SortOrder
    },
  })

  const total = await prisma.services.count({
    where: {
      AND: andConditions
    }
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


export const serviceService = {
  createServiceIntoDB,
  allServicesFromDB,

}