import { Query } from "express-serve-static-core";
import { prisma } from "../../lib/prisma"


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


export const categoryService = {
  getAllCategoryFromDB,

}

