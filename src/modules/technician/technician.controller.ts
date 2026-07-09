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



//& get booking 
const getBooking = catchAsync(
  async(req: Request, res: Response) => {

    const userId = req.user?.id as string

    const result = await technicianService.getBookingFromDB(userId)

    if(result.length === 0){
      return notFoundResponse(res, 'You are not booking services yet')
    }
    return successResponse(res, httpCode.OK, 'Booking retrived successfully', result)
  }
)


//& update booking 
const updateBooking = catchAsync(
  async(req: Request, res: Response) => {

    const id = req.params.bookingId as string
    const body = req.body

    const result = await technicianService.updateBookingFromDB(id, body)

    return successResponse(res, httpCode.OK, 'Booking updated successfully', result)
  }
)



//* view incoming booking
const incommingbook = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.user?.id as string

    const result = await technicianService.incommigBooking(id)
    if(!result){
      return notFoundResponse(res, 'no requested booking')
    }
    return successResponse(res, httpCode.OK, 'new booking retrive successfully', result)
  }
)


export const technicianController = {
  getAllTechnician,
  getTechnicianById,
  getBooking,
  updateBooking,
  incommingbook,
}