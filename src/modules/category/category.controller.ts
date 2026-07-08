import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { categoryService } from "./category.service";
import { badResponse, notFoundResponse, successResponse } from "../../utility/sendResponse";
import httpCode from 'http-status'


//& create category
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



//& UPDATED CATEGORIES BY ID
const updateCategoryById = catchAsync(
  async(req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string
    const body = req.body

    const result = await categoryService.updateCategoriesByIdFromDB(categoryId, body)

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

    const result = await categoryService.deleteCategoriesByIdFromDB(categoryId)

    if(result === 'not'){
      return notFoundResponse(res, 'Category not found!!')
    }
    return successResponse(res, httpCode.OK, 'Category delted successfully', result)
  }
)




export const categoryController = {
  createCategory,
  getAllCategory,
  updateCategoryById,
  deleteCategoryById,

}