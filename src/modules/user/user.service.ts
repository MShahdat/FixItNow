import { Query } from "express-serve-static-core";
import { Prisma } from "../../../generated/prisma/client";
import { Role, UserStatus } from "../../../generated/prisma/enums"
import config from "../../config/env";
import { prisma } from "../../lib/prisma"
import { IUserPass, IUserUpdate } from "./user.interface";
import bcrypt from 'bcrypt'



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



//^ GET USER
const getProfileFromDB = async (role: Role, id: string) => {

  const query: Prisma.UserFindUniqueArgs = {
    where: { id },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  if (role === "TECHNICIAN") {
    query.include = {
      technicianProfile: true,
    };
  }

  const result = await prisma.user.findUnique(query);
  return result
}


//^ USER UPDATE
const updateProfileIntoDB = async (userId: string, payload: IUserUpdate) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { technicianProfile: true },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const userData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    profileImage: payload.profileImage,
    address: payload.address,
    city: payload.city,
  };

  const transectionResult = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData, // Prisma ignores `undefined` keys automatically
      omit: { password: true },
    });

    if (existingUser.role === "TECHNICIAN") {
      const technicianData = {
        bio: payload.bio,
        skills: payload.skills,
        experience:
          payload.experience !== undefined ? Number(payload.experience) : undefined,
        hourlyRate:
          payload.hourlyRate !== undefined
            ? new Prisma.Decimal(payload.hourlyRate)
            : undefined,
        availability: payload.availability,
      };

      await tx.technicianProfile.update({
        where: { userId: userId },
        data: technicianData,
      });
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      omit: { password: true },
      include: { technicianProfile: true },
    });

    return user;
  });

  return transectionResult;
};


//^ PASSWORD UPDATE
const updatePassIntoDB = async (id: string, payload: IUserPass) => {

  const { password } = payload
  
  if(!password){
    return 'not'
  }

  const hasPass = await bcrypt.hash(password as string, Number(config.solt_or_rounds))

  await prisma.user.update({
    where: { id },
    data: {
      password: hasPass
    }
  })

}

export const userService = {
  getAllUsersFromDB,
  getProfileFromDB,
  updateProfileIntoDB,
  updatePassIntoDB,

}