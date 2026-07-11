import config from "../../config/env";
import { prisma } from "../../lib/prisma";
import { Prisma, Role, UserStatus } from "../../../generated/prisma/client";
import { IUserLogin, IUserRegister } from "./auth.interface"
import bcrypt from 'bcrypt'
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtToken } from "../../utility/jwt";
import jwt from "jsonwebtoken";






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
    skills: payload.skills ?? [],
    experience: payload.experience !== undefined ? Number(payload.experience) : null,
    hourlyRate: payload.hourlyRate !== undefined
      ? new Prisma.Decimal(payload.hourlyRate)
      : new Prisma.Decimal(0),
    availability: payload.availability ?? []
  }

  const transectionResult = await prisma.$transaction(
    async (tx) => {
      const createdUser = await tx.user.create({
        data: userData,
        omit: {
          password: true,
        },
      })

      if (payload.role === "TECHNICIAN") {
        await tx.technicianProfile.create({
          data: {
            ...technicianData,
            userId: createdUser.id
          }
        })
      }

      const user = await tx.user.findUnique({
        where: { email },
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true
        },
        include: {
          technicianProfile: true
        }
      })

      return user
    },
    {
      maxWait: 50000,
      timeout: 100000, // for network issues
    }
  )

  return transectionResult
}



//& USER LOGIN
const userLoginFromDB = async (payload: IUserLogin) => {

  const { email, password } = payload
  console.log('payload ', payload)

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return null
  }


  const pass = user.password
  const isMatch = await bcrypt.compare(password, pass)

  if (!isMatch) {
    return 'invalid'
  }

  //& JWT TOKEN GENERATE
  const { id, firstName, lastName, role, phone, status } = user

  const jwtPayload = {
    id,
    firstName,
    lastName,
    role,
    phone,
    status
  } as JwtPayload

  console.log('jwt payload ', jwtPayload)

  const accessToken = jwtToken.createToken(
    jwtPayload,
    config.jwt_access_sectet,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  )

  const refreshToken = jwtToken.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  )

  const result = {
    accessToken: accessToken,
    refreshToken: refreshToken
  }
  return result
}



//& GENERATE REFRESH TOKEN
const generateAccessToken = async (token: string) => {

  if (!token) {
    return 'unauthorized'
  }

  // decode user based on token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload

  const { id } = decoded
  // console.log('decoded', decoded)

  const isUser = await prisma.user.findUnique({
    where: { id }
  })


  const jwtPayload = {
    id: isUser?.id,
    firstName: isUser?.firstName,
    lastName: isUser?.lastName,
    role: isUser?.role,
    phone: isUser?.phone,
    status: isUser?.status
  } as JwtPayload
  // console.log(jwtPayload)

  const accessToken = jwtToken.createToken(
    jwtPayload, 
    config.jwt_access_sectet, 
    config.jwt_access_expires_in as SignOptions['expiresIn']
  )
  // console.log('access token: ', accessToken)

  return accessToken;
}



//& GET ME
const getMeFromDB = async (role: Role, id: string) => {

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


export const authService = {
  userRegisterIntoDB,
  userLoginFromDB,
  generateAccessToken,
  getMeFromDB,

}