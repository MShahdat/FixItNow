import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router()

route.get('/profile', authorization.roleAuth(Role.TECHNICIAN), technicianController.getProfile)

route.put('/profile', authorization.roleAuth(Role.TECHNICIAN), technicianController.updateProfile)

route.patch('/change-password', authorization.roleAuth(Role.TECHNICIAN), technicianController.updatePass)



route.get('/', technicianController.getAllTechnician)

route.get('/bookings', authorization.roleAuth(Role.TECHNICIAN), technicianController.getBooking)

route.get('/:technicianId', technicianController.getTechnicianById)

route.get('/bookings/incomming', authorization.roleAuth(Role.TECHNICIAN), technicianController.incommingbook)

route.get('/bookings/:bookingId', authorization.roleAuth(Role.TECHNICIAN), technicianController.getBookingById)

route.patch('/bookings/:bookingId', authorization.roleAuth(Role.TECHNICIAN), technicianController.updateBookingStatus)


route.patch('/availability', authorization.roleAuth(Role.TECHNICIAN), technicianController.setAvailability)



export const technicianRouter = route