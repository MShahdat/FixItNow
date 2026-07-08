import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { technicianService } from "./technician.service";
import { notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'


//& get all users
const getAllTechnician = catchAsync(
  async(req: Request, res: Response) => {

    const result = await technicianService.getTechnicianFromDB(req.query)

    if (!result.users.length) {
      return notFoundResponse(res, "Technician not found!")
    }

    return successResponse(res, httpCode.OK, 'All technician retrive successfully', result.users, result.meta)
  }
)



export const technicianController = {
  getAllTechnician,

}