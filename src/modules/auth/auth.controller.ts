import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { authService } from "./auth.service";
import { badResponse, errorResponse, notFoundResponse, successResponse, unauthorizedResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'

//& USER REGISTER
const userRegister = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body
    console.log("body", body)

    const result = await authService.userRegisterIntoDB(body);
    console.log('user  ', result)

    return successResponse(res, httpCode.CREATED, 'User register successfully', result)
  }
)


//& USER LOGIN
const userLogin = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body

    const result = await authService.userLoginFromDB(body)

    if (!result) {
      return notFoundResponse(res, 'user not found!!')
    }
    if (result === 'invalid') {
      return badResponse(res, 'invalid email or password')
    }

    res.cookie('refreshToken', result.refreshToken, {
      secure: false,    // set ture in production
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7   // 7 days
    })

    res.cookie('accessToken', result.accessToken, {
      secure: false,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 1   // 1 hour
    })

    successResponse(res, httpCode.OK, 'user loged in successfully', result)
  }
)


//& GENERATE ACCESS TOKEN
const generateAccessToken = catchAsync(async (req: Request, res: Response) => {
  // console.log('cookies : ', req.cookies.refreshToken)

  const token = req.cookies.refreshToken;
  console.log('ok')

  const result = await authService.generateAccessToken(token)
  console.log('result === ', result)

  if (result === 'unauthorized') {
    return unauthorizedResponse(res, 'unauthorized access')
  }

  res.cookie('accessToken', result, {
    secure: false,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 1  // for 1 hour
  })

  const rs = {
    accessToken: result
  }

  return successResponse(res, httpCode.CREATED, 'Access token crated successfully', rs)
})


//& GET ME
const getMe = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return notFoundResponse(res, 'User not found!!')
    }

    const id = req.user?.id as string
    const role = req.user.role
    const result = await authService.getMeFromDB(role, id);

    if (!result) {
      return errorResponse(res, "Internal server error")
    }
    return successResponse(res, httpCode.OK, 'user retrive successfully', result)
  }
)

export const authController = {
  userRegister,
  userLogin,
  generateAccessToken,
  getMe,

}