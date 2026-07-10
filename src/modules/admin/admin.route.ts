
import { Router } from "express"
import { authorization } from "../../middleware/auth"
import { Role } from "../../../generated/prisma/enums"
import { adminController } from "./admin.controller"
import { categoryController } from "../category/category.controller"
import { userController } from "../user/user.controller"


const route = Router()

route.get('/profile', authorization.roleAuth(Role.ADMIN), userController.getProfile)

route.put('/profile', authorization.roleAuth(Role.ADMIN), userController.updateProfile)

route.patch('/change-password', authorization.roleAuth(Role.ADMIN), userController.updatePass)



route.get('/users', authorization.roleAuth(Role.ADMIN), adminController.getAll)

route.patch('/users/update-status/:userId', authorization.roleAuth(Role.ADMIN), adminController.updateStatus)


route.get('/bookings', authorization.roleAuth(Role.ADMIN), adminController.getBooking)

route.post('/categories', authorization.roleAuth(Role.ADMIN), adminController.createCategory)

route.get('/categories', categoryController.getAllCategory)

route.patch('/categories/:categoryId', authorization.roleAuth(Role.ADMIN), adminController.updateCategoryById)

route.delete('/categories/:categoryId', authorization.roleAuth(Role.ADMIN), adminController.deleteCategoryById)


route.get('/payment-history', authorization.roleAuth(Role.ADMIN), adminController.paymentHistory)






export const adminRouter = route