import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { userService } from "./user.service";
import { badResponse, errorResponse, notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'


//& get all users
const getAll = catchAsync(
  async(req: Request, res: Response) => {

    if(!req.user){
      return notFoundResponse(res, 'User not found')
    }
    const result = await userService.getAllUsersFromDB(req.query);

    if (!result.users.length) {
      return notFoundResponse(res, "Users not found!")
    }

    return successResponse(res, httpCode.OK, 'All users retrive successfully', result.users, result.meta)
  }
)


//^ PROFILE GET
const getProfile = catchAsync(
  async (req: Request, res: Response) => {

    if (!req.user) {
      return notFoundResponse(res, 'User not found!!')
    }

    const id = req.user?.id as string
    const role = req.user.role

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
   
    if (!req.user) {
      return notFoundResponse(res, 'User not found!')
    }

    const id = req.user.id as string
    const body = req.body

    const result = await userService.updatePassIntoDB(id, body)

    if(result === 'not'){
      return badResponse(res, 'Entire the password')
    }

    return successResponse(res, httpCode.OK, 'Password updated successfully')
  }
)

export const userController = {
  getAll,
  getProfile,
  updateProfile,
  updatePass,

}