import { prisma } from "../../lib/prisma"
import { ICategoryPayload } from "./category.interface"


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



export const categoryService = {
  createCategoryInfoDB,

}