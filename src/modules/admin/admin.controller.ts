import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { notFoundResponse, successResponse } from "../../utility/sendResponse";
import { adminService } from "./admin.service";
import httpCode from 'http-status'



//& get all users
const getAll = catchAsync(
  async(req: Request, res: Response) => {

    if(!req.user){
      return notFoundResponse(res, 'User not found')
    }
    const result = await adminService.getAllUsersFromDB(req.query);

    if (!result.users.length) {
      return notFoundResponse(res, "Users not found!")
    }

    return successResponse(res, httpCode.OK, 'All users retrive successfully', result.users, result.meta)
  }
)




export const adminControler = {
  getAll,

}