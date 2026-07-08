import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { technicianService } from "./technician.service";
import { notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'


//& get all technician
const getAllTechnician = catchAsync(
  async(req: Request, res: Response) => {

    const result = await technicianService.getTechnicianFromDB(req.query)

    if (!result.users.length) {
      return notFoundResponse(res, "Technician not found!")
    }

    return successResponse(res, httpCode.OK, 'All technician retrive successfully', result.users, result.meta)
  }
)


//& get technician by id
const getTechnicianById = catchAsync(
  async(req: Request, res: Response) => {

    const id = req.params.technicianId as string
    const result = await technicianService.getTechnicianByIdFromDB(id)

    if (!result) {
      return notFoundResponse(res, "Technician not found!")
    }

    return successResponse(res, httpCode.OK, 'All technician retrive successfully', result)
  }
)


export const technicianController = {
  getAllTechnician,
  getTechnicianById,

}