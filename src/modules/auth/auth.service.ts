import config from "../../config/env";
import { prisma } from "../../lib/prisma";
import { IUserRegister } from "./auth.interface"
import bcrypt from 'bcrypt'


//& USER REGISTER
const userRegisterIntoDB = async (payload: IUserRegister) => {
  const { firstName, lastName, email, password, phone, address, city, role, status } = payload;

  if (email) {
    const isUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (isUser) {
      throw new Error("User already exists")
    }
  }

  const hasPass = await bcrypt.hash(password as string, Number(config.solt_or_rounds))

  const userData = {
    firstName,
    lastName,
    email,
    password: hasPass,
    phone,
    address,
    city,
    role,
    status: status || "ACTIVE"
  }

  const technicianData = {
    bio: payload.bio ?? null,
    experience: payload.experience ?? null,
    workingHours: payload.workingHours ?? [],
    availability: payload.availability ?? true,
    verified: payload.verified ?? false
  }

  const transectionResult = await prisma.$transaction(
    async (tx) => {
      const createdUser = await tx.user.create({
        data: userData,
        omit: {
          password: true
        }
      })

      if(payload.role === "TECHNICIAN") {
        await tx.technicianProfile.create({
          data: {
            ...technicianData,
            userId: createdUser.id
          }
        })
      }
      return createdUser
    },
    {
      maxWait: 50000,
      timeout: 100000, // for network issues
    }
  )

  return transectionResult
}


export const authService = {
  userRegisterIntoDB,

}