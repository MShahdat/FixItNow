import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { userService } from "./user.service";
import { badResponse, errorResponse, notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'
import { Role } from "../../../generated/prisma/enums";



//^ PROFILE GET
const getProfile = catchAsync(
  async (req: Request, res: Response) => {

    const id = req.user?.id as string
    const role = req.user?.role as Role

    const result = await userService.getProfileFromDB(role, id);

    if (!result) {
      return errorResponse(res, "Internal server error")
    }
    return successResponse(res, httpCode.OK, 'user retrive successfully', result)
  }
)



//& UPDATE PROFILE
const updateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const body = req.body;

    const result = await userService.updateProfileIntoDB(userId, body);

    return successResponse(res, httpCode.OK, 'Profile updated successfully', result);
  }
);



//^ PASSWORD UPDATE
const updatePass = catchAsync(
  async (req: Request, res: Response) => {
   
    const id = req.user?.id as string
    const body = req.body

    const result = await userService.updatePassIntoDB(id, body)

    if(result === 'not'){
      return badResponse(res, 'Entire the password')
    }

    return successResponse(res, httpCode.OK, 'Password updated successfully')
  }
)


//& DELTE USER
const deleteUser = catchAsync(
  async(req: Request, res: Response) => {
    const id = req.user?.id as string

    await userService.deleteProfileFromDB(id)
    return successResponse(res, httpCode.OK, 'user deleted successfully')
  }
)


export const userController = {
  getProfile,
  updateProfile,
  updatePass,
  deleteUser,
  
}