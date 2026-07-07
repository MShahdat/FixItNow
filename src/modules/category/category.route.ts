import { Router } from "express";
import { categoryController } from "./category.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router()

route.post('/', authorization.roleAuth(Role.ADMIN), categoryController.createCategory)






export const categoryRouter = route