import { Router } from "express";
import { categoryController } from "./category.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router()

route.post('/', authorization.roleAuth(Role.ADMIN), categoryController.createCategory)
route.get('/', authorization.roleAuth(Role.ADMIN), categoryController.getAllCategory)
route.patch('/:categoryId', authorization.roleAuth(Role.ADMIN), categoryController.updateCategoryById)
route.delete('/:categoryId', authorization.roleAuth(Role.ADMIN), categoryController.deleteCategoryById)


export const categoryRouter = route