import { Query } from "express-serve-static-core";
import { Prisma, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";



//& GET ALL TECHNICIAN
const getTechnicianFromDB = async (query: Query) => {

  const sort = query.sortBy ? query.sortBy : 'createdAt';
  const order = query.sortOrder ? query.sortOrder : 'desc';
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)

  const andConditions: Prisma.UserWhereInput[] = []


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
      technicianProfile: true,
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



export const technicianService = {
  getTechnicianFromDB,

}