import { Request, Response } from "express"
import catchAsync from "../../utility/catchAsync"
import { serviceService } from "./service.service"
import { notFoundResponse, successResponse, unauthorizedResponse } from "../../utility/sendResponse"
import httpCode from 'http-status'


//& CREATE SERVICES
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


//& GET ALL SERVICES
const getAllServices = catchAsync(
  async(req: Request, res: Response) => {
    
    const result = await serviceService.allServicesFromDB(req.query)
    if(result.services.length === 0){
      return notFoundResponse(res, 'sercices not found')
    }
    return successResponse(res, httpCode.OK, 'Services retrive successfully', result.services, result.meta)
  }
)



//& UPDATE SERVICE PROFILE
const updateService = catchAsync(
  async(req: Request, res: Response) => {

    const id = req.params.serviceId as string
    const userId = req.user?.id as string
    
    const result = await serviceService.updateServiceIntoDB(id, userId, req.body)
    
    if(result === 'unauth'){
      return unauthorizedResponse(res, 'unauthorized access')
    }

    if(!result){
      return notFoundResponse(res, 'service not fouond!')
    }

    return successResponse(res, httpCode.OK, 'servcie updated successfully', result)
  }
)


export const serviceController = {
  createService,
  getAllServices,
  updateService,
  
}