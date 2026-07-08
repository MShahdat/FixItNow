
import { Router } from "express"
import { userController } from "./user.controller"
import { authorization } from "../../middleware/auth"
import { Role } from "../../../generated/prisma/enums"


const route = Router()
route.get('/', authorization.roleAuth(Role.ADMIN), userController.getAll)
route.get('/profile', authorization.roleAuth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), userController.getProfile)
route.put('/profile', authorization.roleAuth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), userController.updateProfile)
route.patch('/change-password', authorization.roleAuth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), userController.updatePass)

route.patch('/:userId', authorization.roleAuth(Role.ADMIN), userController.updateStatus)


export const userRouter = route