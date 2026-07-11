import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { adminService } from "./admin.service";
import { badResponse, notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'
import { bookingService } from "../booking/booking.service";


//& get all users
const getAll = catchAsync(
  async(req: Request, res: Response) => {

    const query = req.query as any

    const result = await adminService.getAllUsersFromDB(query);

    if (!result.users.length) {
      return notFoundResponse(res, "Users not found!")
    }

    return successResponse(res, httpCode.OK, 'All users retrive successfully', result.users, result.meta)
  }
)


//& update status 
const updateStatus = catchAsync(
  async(req: Request, res: Response) => {
    const id = req.params.userId as string
    const body = req.body

    const result = await adminService.updateStatusIntoDB(id, body)
    
    if(result === 'not'){
      return notFoundResponse(res, 'User not found')
    }
    return successResponse(res, httpCode.OK, 'User status updated successfully', result)
  }
)



//& create category
const createCategory = catchAsync(
  async(req: Request, res: Response) => {
    const body = req.body;

    const result = await adminService.createCategoryIntoDB(body);

    if(!result){
      return badResponse(res, 'some filed missng')
    }
    if(result === 'exist'){
      return badResponse(res, 'Category already exists!')
    }

    return successResponse(res, httpCode.CREATED, 'Category created successfully', result)
  }
)



//& get booking
const getBooking = catchAsync(
  async(req: Request, res: Response) => {

    const result = await adminService.getBookingFromDB()

    if(result.length === 0){
      return notFoundResponse(res, 'You are not booking services yet')
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



//& UPDATED CATEGORIES BY ID
const updateCategoryById = catchAsync(
  async(req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string
    const body = req.body

    const result = await adminService.updateCategoriesByIdFromDB(categoryId, body)

    if(!result){
      return notFoundResponse(res, 'Category not found!!')
    }
    return successResponse(res, httpCode.OK, 'Category updated successfully', result)
  }
)



//& DELETED CATEGORIES BY ID
const deleteCategoryById = catchAsync(
  async(req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string

    const result = await adminService.deleteCategoriesByIdFromDB(categoryId)

    if(result === 'not'){
      return notFoundResponse(res, 'Category not found!!')
    }
    return successResponse(res, httpCode.OK, 'Category delted successfully', result)
  }
)


//& payment history
const paymentHistory = catchAsync(
  async(req: Request, res: Response) => {

    const result = await adminService.paymentHisotyFromDB()

    if(result.length === 0){
      return notFoundResponse(res, 'No payment history yet')
    }
    return successResponse(res, httpCode.OK, 'all history retrive successfully', result)
  }
)



export const adminController = {
  getAll,
  updateStatus,
  getBooking,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  paymentHistory,
  getBookingById,

}