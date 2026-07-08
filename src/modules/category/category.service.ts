import { Query } from "express-serve-static-core";
import { prisma } from "../../lib/prisma"
import { ICategoryPayload, ICategoryUpdate } from "./category.interface"
import catchAsync from "../../utility/catchAsync";



//& create category
const createCategoryInfoDB = async (payload: ICategoryPayload) => {
  const {name, description} = payload

  if(!name || !description){
    return null
  }
  
  const cat = await prisma.category.findUnique({
    where: {
      name
    }
  })

  if(cat){
    return 'exist'
  }

  const result = await prisma.category.create({
    data: {
      ...payload
    }
  })

  return result
}



//& get all category from db
const getAllCategoryFromDB = async (query: Query) => {

  const sort = query.sortBy ? query.sortBy : 'createdAt';
  const order = query.sortOrder ? query.sortOrder : 'desc';
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 15)

  const category = await prisma.category.findMany({
    take: limit,
    skip: (page - 1) * limit
  })


  const total = await prisma.category.count()

  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  }

  return {
    category,
    meta
  }
}



//& UPDATE CATEGORIES
const updateCategoriesByIdFromDB = async (categoryId: string, payload: ICategoryUpdate) => {
  
  const category = await prisma.category.findUnique({
    where: {id: categoryId}
  })
  if(!category){
    return null
  }

  const updated = await prisma.category.update({
    where: {id: categoryId},
    data: {
      ...payload
    }
  })
  return updated
}



//& DELETE CATEGORIES BY ID
const deleteCategoriesByIdFromDB = async (categoryId: string) => {
  
  const category = await prisma.category.findUnique({
    where: {id: categoryId}
  })
  if(!category){
    return 'not'
  }

  await prisma.category.delete({
    where: {id: categoryId}
  })
}




export const categoryService = {
  createCategoryInfoDB,
  getAllCategoryFromDB,
  updateCategoriesByIdFromDB,
  deleteCategoriesByIdFromDB,

}

