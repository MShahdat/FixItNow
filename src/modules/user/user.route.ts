
import { Router } from "express"
import { userController } from "./user.controller"
import { authorization } from "../../middleware/auth"
import { Role } from "../../../generated/prisma/enums"


const route = Router()
route.get('/profile', authorization.roleAuth(Role.CUSTOMER), userController.getProfile)

route.put('/profile', authorization.roleAuth(Role.CUSTOMER), userController.updateProfile)

route.patch('/change-password', authorization.roleAuth(Role.CUSTOMER), userController.updatePass)

route.delete('/delete', authorization.roleAuth(Role.CUSTOMER), userController.deleteUser)




export const userRouter = route