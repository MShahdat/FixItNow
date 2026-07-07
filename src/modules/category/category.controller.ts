import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { categoryService } from "./category.service";
import { badResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'

const createCategory = catchAsync(
  async(req: Request, res: Response) => {
    const body = req.body;

    const result = await categoryService.createCategoryInfoDB(body);

    if(!result){
      return badResponse(res, 'some filed missng')
    }
    if(result === 'exist'){
      return badResponse(res, 'Category already exists!')
    }

    return successResponse(res, httpCode.CREATED, 'Category created successfully', result)
  }
)


export const categoryController = {
  createCategory,
  
}