import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router()

route.post('/', authorization.roleAuth(Role.CUSTOMER), bookingController.createBooking)

route.get('/my-bookings', authorization.roleAuth(Role.CUSTOMER), bookingController.getBooking)

route.get('/:bookingId', authorization.roleAuth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getBookingById)

route.patch('/cancel/:bookingId', authorization.roleAuth(Role.CUSTOMER), bookingController.cancleBooking)

export const bookingRouter = route