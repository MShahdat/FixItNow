import { Prisma } from "../../../generated/prisma/client";
import { Role, UserStatus } from "../../../generated/prisma/enums"
import config from "../../config/env";
import { prisma } from "../../lib/prisma"
import { IUserPass, IUserUpdate } from "./user.interface";
import bcrypt from 'bcrypt'



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

  const isUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUser) {
    throw new Error("User not found");
  }

  const userData: Prisma.UserUpdateInput = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    profileImage: payload.profileImage,
    address: payload.address,
    city: payload.city,
  };

  const result = await prisma.$transaction(
    async (tx) => {
    
      const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData,
      omit: {
        password: true,
      },
    });

    if (isUser.role !== "TECHNICIAN") {
      return updatedUser;
    }

    const technicianData: Prisma.TechnicianProfileUpdateInput = {
      bio: payload.bio,
      skills: payload.skills,
      experience: payload.experience === undefined ? undefined
          : payload.experience === null ? null
          : Number(payload.experience),
      hourlyRate: payload.hourlyRate !== undefined ? new Prisma.Decimal(payload.hourlyRate)
          : undefined,
      availability: payload.availability,
    };

    const updatedTechnicianProfile =
      await tx.technicianProfile.update({
        where: { userId },
        data: technicianData,
      });

    return {
      ...updatedUser,
      technicianProfile: updatedTechnicianProfile,
    };
  });

  return result;
};


//^ PASSWORD UPDATE
const updatePassIntoDB = async (id: string, payload: IUserPass) => {

  const { password } = payload

  if (!password) {
    return 'not'
  }

  console.log('pass', password)

  const hasPass = await bcrypt.hash(password as string, Number(config.solt_or_rounds))

  await prisma.user.update({
    where: { id },
    data: {
      password: hasPass
    }
  })

}


const deleteProfileFromDB = async(id: string) => {

  await prisma.user.delete({
    where: {id}
  })
  
}



export const userService = {
  getProfileFromDB,
  updateProfileIntoDB,
  updatePassIntoDB,
  deleteProfileFromDB,

}