import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { technicianService } from "./technician.service";
import { badResponse, errorResponse, notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'
import { Role } from "../../../generated/prisma/enums";
import { userService } from "../user/user.service";
import { bookingService } from "../booking/booking.service";



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
      return notFoundResponse(res, 'not booking found')
    }
    return successResponse(res, httpCode.OK, 'Booking retrived successfully', result)
  }
)

//& get booking by id
const getBookingById = catchAsync(
  async(req: Request, res: Response) => {

    const id = req.params.bookingId as string

    const result = await bookingService.getBookingById(id)

    if(!result){
      return notFoundResponse(res, 'Booking is not found')
    }
    return successResponse(res, httpCode.CREATED, 'Booking created successfully', result)
  }
)


//& update booking 
const updateBookingStatus = catchAsync(
  async(req: Request, res: Response) => {

    const id = req.params.bookingId as string
    const body = req.body

    const result = await technicianService.updateBookingStatusFromDB(id, body)

    if(!result){
      return notFoundResponse(res, 'booking not found')
    }

    return successResponse(res, httpCode.OK, 'Booking updated successfully', result)
  }
)



//* view incoming booking
const incommingbook = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.user?.id as string

    const result = await technicianService.incommigBooking(id)
    if(result.length === 0){
      return notFoundResponse(res, 'no requested booking')
    }
    return successResponse(res, httpCode.OK, 'New booking retrive successfully', result)
  }
)


//& update availability
const setAvailability = catchAsync(
  async(req: Request, res: Response) => {
    const id = req.user?.id as string
    
    const result = await technicianService.setAvailabilityIntoDB(id, req.body)
    
    return successResponse(res, httpCode.OK, 'updated availability time', result)
  }
)




export const technicianController = {
  getProfile,
  updateProfile,
  updatePass,
  getAllTechnician,
  getTechnicianById,
  getBooking,
  updateBookingStatus,
  incommingbook,
  setAvailability,
  getBookingById,
  
}