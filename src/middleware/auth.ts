import { NextFunction, Request, Response } from "express";
import catchAsync from "../utility/catchAsync";
import { forbiddenResponse, unauthorizedResponse } from "../utility/sendResponse";
import { jwtToken } from "../utility/jwt";
import config from "../config/env";



const roleAuth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken
      :
      req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1]
        :
        req.headers.authorization

    if (!token) {
      return unauthorizedResponse(res, 'Unauthorized access');
    }

    const decoded = jwtToken.jwtVerify(token, config.jwt_access_sectet)

    if (!decoded) {
      return unauthorizedResponse(res, "unauthorized access")
    }
    console.log('decoded', decoded)

    const {id, firstName, lastName, email, phone, status, role } = decoded;
    
    console.log(`loged user role "${role}" and status "${status}"`)
    console.log('permitted roles ', roles)

    if (status === 'BLOCKED') {
      throw new Error('user temporary blocked')
    }

    if (!roles.includes(role)) {
      return forbiddenResponse(res, 'do not permit for you')
    }

    req.user = {
      id,
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
    }
    next();
  })
}


export const authorization = {
  roleAuth,
}

