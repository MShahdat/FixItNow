import { Query } from "express-serve-static-core";
import { Prisma, Role, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Prisma as PrismaClient } from "../../../generated/prisma/client";


//& GET ALL USERS

const getAllUsersFromDB = async (query: Query) => {

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
        },
        {
          address: {
            contains: query.search as string,
            mode: "insensitive"
          }
        },
        {
          city: {
            contains: query.search as string,
            mode: "insensitive"
          }
        }
      ]
    })
  }

  //! filtering
  if (query.skill) {
    const skill = query.skill as string
    const arrSkill = skill.split(',').map((item) => item.trim())

    andConditions.push({
      technicianProfile: {
        skills: {
          hasSome: arrSkill
        }
      }
    })
  }

  if (query.verify) {
    andConditions.push({
      technicianProfile: {
        isVerified: Boolean(query.verify)
      }
    })
  }

  if (query.role) {
    andConditions.push({
      role: (query.role as string).toUpperCase() as Role,
    });
  } else {
    andConditions.push({
      role: {
        in: [Role.CUSTOMER, Role.TECHNICIAN],
      },
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as UserStatus
    })
  }
  if (query.isAvailable) {
    andConditions.push({
      technicianProfile: {
        isAvailable: Boolean(query.isAvailable)
      }
    })
  }

  if (query.experience) {
    andConditions.push({
      technicianProfile: {
        experience: Number(query.experience)
      }
    })
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

export const adminService = {
  getAllUsersFromDB,

}