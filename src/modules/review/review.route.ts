import { Router } from "express"
import { authorization } from "../../middleware/auth"
import { Role } from "../../../generated/prisma/enums"
import { reviewController } from "./review.controller"


const route = Router()

route.post('/', authorization.roleAuth(Role.CUSTOMER), reviewController.createBooking)


export const reviewRouter = route