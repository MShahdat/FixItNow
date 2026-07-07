import { Prisma } from "../../../generated/prisma/client";
import { Role } from "../../../generated/prisma/enums"
import config from "../../config/env";
import { prisma } from "../../lib/prisma"
import { IUserPass, IUserUpdate } from "./user.interface";
import bcrypt from 'bcrypt'

//^ USER REGISTER
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
  getProfileFromDB,
  updateProfileIntoDB,
  updatePassIntoDB,

}