import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { bookingService } from "./booking.service";
import { notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpcode from 'http-status'


//& create booking 
const createBooking = catchAsync(
  async(req: Request, res: Response) => {
    const customerId = req.user?.id as string
    const body = req.body

    const result = await bookingService.createBooking(customerId, body)


    if(result === 'not service'){
      return notFoundResponse(res, 'service not found~~')
    }

    return successResponse(res, httpcode.CREATED, 'Booking created successfully', result)
  }
)


//& get booking
const getBooking = catchAsync(
  async(req: Request, res: Response) => {

    const customerId = req.user?.id as string

    const result = await bookingService.getBooking(customerId)

    if(result.length === 0){
      return notFoundResponse(res, 'You are not booking services yet')
    }
    return successResponse(res, httpcode.CREATED, 'Booking created successfully', result)
  }
)



//& get booking by id
const getBookingById = catchAsync(
  async(req: Request, res: Response) => {

    const id = req.params.bookingId as string

    const result = await bookingService.getBookingById(id)

    if(result.length === 0){
      return notFoundResponse(res, 'Booking is not found')
    }
    return successResponse(res, httpcode.CREATED, 'Booking created successfully', result)
  }
)


export const bookingController = {
  createBooking,
  getBooking,
  getBookingById
}