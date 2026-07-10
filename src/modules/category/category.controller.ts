import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { categoryService } from "./category.service";
import { notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'


//& get all category
const getAllCategory = catchAsync(
  async(req: Request, res: Response) => {

    const result = await categoryService.getAllCategoryFromDB(req.query)
    if(result.category.length === 0){
      return notFoundResponse(res, 'No categories found')
    }

    return successResponse(res, httpCode.OK, 'Categories retrive successfully', result.category, result.meta)
  }
)



export const categoryController = {
  getAllCategory,

}