import { Query } from "express-serve-static-core";
import { Prisma, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IBookingUpdate } from "./technician.interface";



//& GET ALL TECHNICIAN
const getTechnicianFromDB = async (query: Query) => {

  const sort = query.sortBy ? query.sortBy : 'createdAt';
  const order = query.sortOrder ? query.sortOrder : 'desc';
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)

  const andConditions: Prisma.UserWhereInput[] = []


  andConditions.push({
    status: "ACTIVE"
  })
  
  
  //! searching
  if (query.search) {
    andConditions.push({
      OR: [
        {
          firstName: {
            contains: query.search as string,
            mode: "insensitive"
          }
        },
        {
          lastName: {
            contains: query.search as string,
            mode: 'insensitive'
          }
        },
        {
          phone: {
            contains: query.search as string,
            mode: "insensitive"
          }
        }
      ]
    })
  }


  //! filtering
  andConditions.push({
    role: Role.TECHNICIAN
  })

  if (query.skills) {
    const skills = query.skills as string
    const arrSkills = skills.split(',').map((item) => item.trim())

    andConditions.push({
      technicianProfile: {
        skills: {
          hasSome: arrSkills
        }
      }
    })
  }

if (query.minExperience || query.maxExperience) {
  andConditions.push({
    technicianProfile: {
      experience: {
      ...(query.minExperience && { gte: Number(query.minExperience) }),
      ...(query.maxExperience && { lte: Number(query.maxExperience) }),
    },
    }
  });
}

  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: (page - 1) * limit,

    orderBy: {
      [sort as string]: order as Prisma.SortOrder
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      technicianProfile: {
        include: {
          services: true,
          reviews: true,
        }
      }
    },
  });

  const total = await prisma.user.count({
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
    meta,
    users
  }
};


//& GET TECHNICIAN BY ID
const getTechnicianByIdFromDB = async (id: string) => {

  const technician = await prisma.user.findUnique({
    where: {id},
    include: {
      technicianProfile: {
        include: {
          reviews: true
        }
      }
    }
  })
  return technician
  
};


//& get booking
const getBookingFromDB = async(userId: string) => {
 
  const techProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {userId}
  })

  const technicianId = techProfile?.id 

  const bookings = await prisma.booking.findMany({
    where: { technicianId },
    include: {
      service: true
    },
  })

  return bookings

}


//& update booking
const updateBookingFromDB = async(id: string, payload: IBookingUpdate) => {


  const updateData = payload.status === 'ACCEPTED' ? 
      {
        status: payload.status,
        acceptedAt: new Date(),
        canceledAt: null,
        cancelReason: null
      } : {
        status: payload.status,
        canceledAt: new Date(),
        cancelReason: payload.cancelReason,
        acceptedAt: null
      }


  const updated = await prisma.booking.update({
    where: {id},
    data: updateData
  })

  return updated
}

export const technicianService = {
  getTechnicianFromDB,
  getTechnicianByIdFromDB,
  getBookingFromDB,
  updateBookingFromDB

}