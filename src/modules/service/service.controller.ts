import { Request, Response } from "express"
import catchAsync from "../../utility/catchAsync"
import { serviceService } from "./service.service"
import { notFoundResponse, successResponse } from "../../utility/sendResponse"
import httpCode from 'http-status'

const createService = catchAsync(
  async(req: Request, res: Response) => {
    const body = req.body
    const technichianId = req.user?.id as string

    const result = await serviceService.createServiceIntoDB(technichianId, body)

    if(!result){
      return notFoundResponse(res, 'This category not found. please added valid category')
    }
    return successResponse(res, httpCode.CREATED, 'Service created successfully', result)
  }
)


export const serviceController = {
  createService,

}